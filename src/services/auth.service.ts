import { email } from "zod";
import { UserRepository } from "../repositories/user.repository.js";
import { ExternalTokenRepository } from "../repositories/externalToken.repository.js";
import { LoginRequest } from "../types/dto/login.dto.js";
import { AppError } from "../core/http/error.js";
import logger from "../config/logger.js";
import bcrypt from "bcryptjs";
import { GMLoginAdapter } from "../providers/gymmaster/login.adapter.js";
import { SignJWT } from "jose";
import { config } from "../config/env.js";
import { JwtPayload } from "../types/auth/jwt-payload.type.js";

const encoder = new TextEncoder();

const usersRepo = UserRepository;
const tokensRepo = ExternalTokenRepository;

export class AuthService {
	static async login(req: LoginRequest) {
		if (!req.email || !req.password) {
			throw new AppError("Email and password are required", 400);
		}

		const user = await UserRepository.findByEmail(req.email);
		if (!user) {
			logger.warn({ email }, "AuthService.login - user not found");
			throw new AppError("Invalid credentials", 401);
		}

		const match = await bcrypt.compare(req.password, user.password);
		if (!match) {
			logger.warn({ userId: user.id }, "AuthService.login - invalid password");
			throw new AppError("Invalid credentials", 401);
		}

		const extResp = await GMLoginAdapter(req.email, req.password);
		const extId = extResp.memberid || 0;
		const extToken = extResp.token || "";
		const extTokenExpires = extResp.expires || 0;

		try {
			await usersRepo.updateExternalId(user.id, extId);
			logger.info({ userId: user.id, externalId: extId }, "AuthService.login - externalId updated");
		} catch (err: any) {
			logger.warn({ err, userId: user.id }, "AuthService.login - failed updating externalId (continuing)");
			throw new AppError("Failed updating externalId", 500);
		}

		try {
			await tokensRepo.saveToken({
				userId: user.id,
				accessToken: extToken,
				expires: extTokenExpires || 0,
			});
			logger.info({ userId: user.id }, "AuthService.login - external token saved");
		} catch (err: any) {
			logger.warn({ err, userId: user.id }, "AuthService.login - failed saving external token (continuing)");
			throw new AppError("Failed saving external token", 500);
		}

		const payload: JwtPayload = {
			userId: String(user.id),
			email: String(user.email),
			externalId: extId > 0 ? extId : undefined,
		};

		const jwt = await new SignJWT(payload as any)
			.setProtectedHeader({ alg: "HS256" })
			.setExpirationTime(extTokenExpires)
			.sign(encoder.encode(config.JWT_SECRET));

		logger.info({ userId: user.id }, "AuthService.login - success");

		return {
			access_token: jwt,
			expires: extTokenExpires,
      user: {
        id: user.id,
        email: user.email,
        externalId: extId,
      }
		};
	}
}
