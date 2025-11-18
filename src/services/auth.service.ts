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
import { RegisterRequest } from "../types/dto/register.dto.js";

const encoder = new TextEncoder();

const usersRepo = UserRepository;
const tokensRepo = ExternalTokenRepository;

export class AuthService {
	static async login(req: LoginRequest) {
		if (!req.email || !req.password) {
			throw new AppError("Email and password are required", 400);
		}

		const user = await usersRepo.findByEmail(req.email);
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
			role: "member",
			externalId: extId > 0 ? extId : undefined,
		};

    const jwt = await new SignJWT(payload as any)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(extTokenExpires > 0 ? `${extTokenExpires}s` : "7d")
      .sign(encoder.encode(config.JWT_SECRET));

		logger.info({ userId: user.id }, "AuthService.login - success");

		return {
			access_token: jwt,
			expires: extTokenExpires,
			user: {
				id: user.id,
				first_name: user.firstName,
				last_name: user.lastName,
				phone_number: user.phoneNumber,
				email: user.email,
				externalId: extId,
			}
		};
	}

	static async register(req: RegisterRequest) {
		if (!req.email) {
			throw new AppError("Email are required", 400);
		}

		if (!req.phone_number) {
			throw new AppError("Phone Number are required", 400);
		}

		if (!req.first_name) {
			throw new AppError("First Name are required", 400);
		}

		if (!req.last_name) {
			throw new AppError("Last Name are required", 400);
		}

		const salt = await bcrypt.genSalt(10);
		const password = await bcrypt.hash(`${req.last_name}:${req.email.split('@')[0]}:${req.first_name}:BOOKR`, salt);

		const newUser = await usersRepo.create({
			firstName: req.first_name,
			lastName: req.last_name,
			email: req.email,
			phoneNumber: req.phone_number,
			password: password,
			externalId: 0
		})
		if (!newUser) {
			logger.error("AuthService.create - error creating user");
			throw new AppError("Error creating user", 500);
		}

		const payload: JwtPayload = {
			userId: String(newUser.id),
			email: String(newUser.email),
			role: "member",
			externalId: 0,
		};

		const jwt = await new SignJWT(payload as any)
			.setProtectedHeader({ alg: "HS256" })
			.setExpirationTime("1d")
			.sign(encoder.encode(config.JWT_SECRET));

		logger.info({ userId: newUser.id }, "AuthService.register - success");

		const newExternalToken = await tokensRepo.create({
			userId: newUser.id,
			accessToken: jwt,
			expires: 86400
		});
		if (!newExternalToken) {
			logger.error("AuthService.create - error creating external token");
			throw new AppError("Error creating external token", 500);
		}

		return {
			access_token: jwt,
			expires: 86400,
			user: {
				id: newUser.id,
				first_name: newUser.firstName,
				last_name: newUser.lastName,
				phone_number: newUser.phoneNumber,
				email: newUser.email,
				externalId: 0,
			}
		};
	}
}
