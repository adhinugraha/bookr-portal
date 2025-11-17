import axios from "axios";
import logger from "../../config/logger.js";
import { config } from "../../config/env.js";
import { AppError, VendorError } from "../../core/http/error.js";
import { ExternalTokenRepository } from "../../repositories/externalToken.repository.js";

const extTokenRepo = ExternalTokenRepository;

export async function GMMemberAdapter(id: string) {
	logger.info({ userId: id }, "GMMemberAdapter show");

	const url = `${config.GYMMASTER_BASE_URL}/portal/api/v1/member/profile`;

	const extToken = await extTokenRepo.findByUser(id);
	if (!extToken) {
		logger.warn({ userId: id }, "GMMemberAdapter - external token not found");
		throw new AppError("External token not found", 404);
	}

	const { data } = await axios.get(url, {
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		params: {
			'api_key': config.GYMMASTER_API_KEY_MEMBER,
			"token": extToken.accessToken
		}
	})
	.catch(err => {
		logger.error({ err }, "GMMemberAdapter error");
		throw new VendorError( data.error || err.message || "Something went wrong", err.statusCode );
	});

	const result = data.result || {};

	return result;
}
