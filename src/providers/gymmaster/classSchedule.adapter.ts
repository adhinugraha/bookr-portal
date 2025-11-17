import axios from "axios";
import logger from "../../config/logger.js";
import { config } from "../../config/env.js";
import { AppError, VendorError } from "../../core/http/error.js";
import { ExternalTokenRepository } from "../../repositories/externalToken.repository.js";

const extTokenRepo = ExternalTokenRepository;

export async function GMClassScheduleAdapter(userId: string, classId: number) {
	logger.info({ userId, classId }, "GMClassScheduleAdapter show");

	const url = `${config.GYMMASTER_BASE_URL}/portal/api/v2/booking/classes`;

	const extToken = await extTokenRepo.findByUser(userId);
	if (!extToken) {
		logger.warn({ userId: userId }, "GMClassScheduleAdapter - external token not found");
		throw new AppError("External token not found", 404);
	}

	const { data } = await axios.get(url, {
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		params: {
			'api_key': config.GYMMASTER_API_KEY_MEMBER,
			"token": extToken,
			"classid": classId
		}
	})
	.catch(err => {
		logger.error({ err }, "GMClassScheduleAdapter error");
		throw new VendorError( data.error || err.message || "Something went wrong", err.statusCode );
	});

	const results = data.result || {};

	const datas = [];

	for (const item of results) {
		datas.push({
			id: item.id,
			name: item.bookingname,
			parent_id: item.classid,
			parent_name: item.classname,
			description: item.description,
			instruction: item.online_instruction,
			image: item.image,
			bgcolour: item.bgcolour,
			price: item.price,
			date: item.arrival,
			day_str: item.dayofweek,
			start_time: item.starttime,
			end_time: item.endtime,
			start_time_str: item.start_str,
			end_time_str: item.end_str,
			location: item.location,
			staff_name: item.staffname,
			staff_photo: item.staffphoto,
			substitute_staff: item.substitutestaff,
			bookable: item.bookable,
			availability: item.availability,
			already_booked: item.already_booked_id,
			multiple_bookings: item.multiplebookings,
			seat_allocation: item.seatallocation,
			max_students: item.max_students,
			spaces_free: item.spacesfree,
			num_students: item.num_students,
			max_waitinglist: item.max_waitinglist,
			waitlist_count: item.waitlist_count,
		});
	}

	return datas;
}
