import { UserRepository } from "../repositories/user.repository.js";
import { AppError } from "../core/http/error.js";
import logger from "../config/logger.js";
import { GMMemberAdapter } from "../providers/gymmaster/member.adapter.js";
import type { AuthRequest } from "../types/index.js";

const usersRepo = UserRepository;

export class UserService {
    static async getProfile(req: AuthRequest) {

		const user = await usersRepo.findByEmail(req.user?.email || "");
		if (!user) {
			logger.warn({ userId: user.id }, "UserService.getProfile - user not found");
			throw new AppError("User not found", 404);
		}

		const extData = await GMMemberAdapter(user.id);

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
