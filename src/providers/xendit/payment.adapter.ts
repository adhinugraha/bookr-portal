import axios from "axios";
import logger from "../../config/logger.js";
import { config } from "../../config/env.js";
import { VendorError } from "../../core/http/error.js";

export async function XNPaymentAdapter(datas: any) {
	logger.info({ userId: datas.user.id }, "Xendit payment");

	const now = Date.now();
    const timestamp = new Date().setMilliseconds(now)
	const refPath = `${timestamp}-${datas.class.external_id}-${datas.user.externalId}`
	const refUri = Buffer.from(`${datas.invoice.id}:${refPath}`).toString("base64")

	const body = {
		reference_id: `BOOKR-${refPath}`,
		type: "PAY",
		country: "ID",
		currency: "IDR",
		request_amount: datas.invoice.amount,
		capture_method: "AUTOMATIC",
		channel_code: "CARDS",
		channel_properties: {
			card_details: {
				cvn: datas.paymentDetail.cvn,
				card_number: datas.paymentDetail.cardNumber,
				cardholder_first_name: datas.paymentDetail.cardholderFirstName,
				cardholder_last_name: datas.paymentDetail.cardholderLastName,
				cardholder_email: datas.paymentDetail.cardholderEmail,
				expiry_month: datas.paymentDetail.expiryMonth,
				expiry_year: datas.paymentDetail.expiryYear
			},
			failure_return_url: `https://bookr.app/payment/failed?ref=${refUri}`,
			success_return_url: `https://bookr.app/payment/success?ref=${refUri}`,
			statement_descriptor: "BOOKR-SERVICE-BOOKING"
		},
		description: `${datas.class.name} - Booking`,
		metadata: {
			service_name: datas.class.name,
			internal_id: datas.invoice.code,
			order_source: "Bookr App"
		}
	};

	const url = `${config.XENDIT_BASE_URL}/v3/payment_requests`;
	const token = Buffer.from(`${config.XENDIT_SECRET_KEY}:`).toString("base64");

	const { data } = await axios.post(url, body, {
		headers: { 
			"Content-Type": "application/json",
			"Authorization": `Basic ${token}`
		}
	})
	.catch(err => {
		logger.error({ err }, "XNPaymentAdapter error");
		throw new VendorError( data.error || err.message || "Something went wrong", err.statusCode );
	});

	const result = data.data || {};

	return result;
}
