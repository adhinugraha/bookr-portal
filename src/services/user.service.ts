import { UserRepository } from "../repositories/user.repository.js";
import { AppError } from "../core/http/error.js";
import logger from "../config/logger.js";
import { GMMemberAdapter } from "../providers/gymmaster/member.adapter.js";
import { ExternalTokenRepository } from "../repositories/externalToken.repository.js";
import type { AuthRequest } from "../types/index.js";

const usersRepo = UserRepository;
const extTokenRepo = ExternalTokenRepository;

export class UserService {
    static async getProfile(req: AuthRequest) {

		const user = await usersRepo.findByEmail(req.user?.email || "");
		if (!user) {
			logger.warn({ userId: user.id }, "UserService.getProfile - user not found");
			throw new AppError("User not found", 404);
		}

		const extToken = await extTokenRepo.findByUser(user.id);
		if (!extToken) {
			logger.warn({ userId: user.id }, "UserService.getProfile - external token not found");
			throw new AppError("External token not found", 404);
		}

		const extData = await GMMemberAdapter(extToken.accessToken);

    const data = {
      id: user.id,
      email: user.email,
      first_name: extData.firstName,
      last_name: extData.surname,
      phone_number: extData.phonecell,
      phone_home: extData.phonehome,
      dob: extData.dob,
      gender: extData.gender,
      address_street: extData.addressstreet,
      address_sub_urb: extData.addresssuburb,
      address_city: extData.addresscity,
      address_country: extData.addresscountry,
      address_area_code: extData.addressareacode,
      image: extData.memberphoto
    }

		return data;
	}
}
