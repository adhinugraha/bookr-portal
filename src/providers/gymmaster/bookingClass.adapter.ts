import axios from "axios";
import logger from "../../config/logger.js";
import { config } from "../../config/env.js";
import { AppError, VendorError } from "../../core/http/error.js";
import { ExternalTokenRepository } from "../../repositories/externalToken.repository.js";

const extTokenRepo = ExternalTokenRepository;

export async function GMBookingClassAdapter(userId: string, scheduleId: string) {
	logger.info({ userId }, "GymMaster booking class");

	const extToken = await extTokenRepo.findByUser(userId);
	if (!extToken) {
		logger.warn({ userId: userId }, "GMBookingClassAdapter - external token not found");
		throw new AppError("External token not found", 404);
	}

	const body = {
		api_key: config.GYMMASTER_API_KEY_MEMBER,
		token: extToken.accessToken,
		bookings: [
			{
				bookingparentid: scheduleId,
				seat: null
			}
		]
	};

	const url = `${config.GYMMASTER_BASE_URL}/portal/api/v2/booking/classes`;

	const { data } = await axios.post(url, body, {
		headers: { "Content-Type": "application/json" }
	})
	.catch(err => {
		logger.error({ err }, "GMBookingClassAdapter error");
		throw new VendorError( data.error || err.message || "Something went wrong", err.statusCode );
	});

	const result = data.result || {};

	return result;
}
