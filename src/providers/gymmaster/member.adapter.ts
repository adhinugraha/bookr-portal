import axios from "axios";
import qs from "qs";
import { logger } from "../../config/logger.js";
import { config } from "../../config/env.js";
import { VendorError } from "../../core/http/error.js";

export async function GMMemberAdapter(token: string) {
	logger.info({ token }, "GMMemberAdapter show");

	const url = `${config.GYMMASTER_BASE_URL}/portal/api/v1/member/profile`;

	const { data } = await axios.get(url, {
		headers: { "Content-Type": "application/x-www-form-urlencoded" }
	})
	.catch(err => {
		logger.error({ err }, "GMMemberAdapter error");
		throw new VendorError( data.error || err.message || "Something went wrong", err.statusCode );
	});

	const result = data.result || {};

	return result;
}
