import axios from "axios";
import qs from "qs";
import { logger } from "../../config/logger.js";
import { config } from "../../config/env.js";
import { VendorError } from "../../core/http/error.js";

export async function GMLoginAdapter(email: string, password: string) {
	logger.info({ email }, "GymMaster login");

	const body = qs.stringify({
		api_key: config.GYMMASTER_API_KEY_MEMBER,
		email,
		password
	});

	const url = `${config.GYMMASTER_BASE_URL}/portal/api/v1/login`;

	const { data } = await axios.post(url, body, {
		headers: { "Content-Type": "application/x-www-form-urlencoded" }
	})
	.catch(err => {
		logger.error({ err }, "GMLoginAdapter error");
		throw new VendorError( data.error || err.message || "Something went wrong", err.statusCode );
	});

	const result = data.result || {};

	return result;
}
