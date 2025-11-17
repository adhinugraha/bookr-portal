import logger from "../config/logger.js";
import { AppError } from "../core/http/error.js";
import { GMClassScheduleAdapter } from "../providers/gymmaster/classSchedule.adapter.js";
import { ClassRepository } from "../repositories/class.repository.js";
import { AuthRequest } from "../types/index.js";

const classRepo = ClassRepository;

export class ClassScheduleService {
  	static async getAll(req: AuthRequest) {
		const userId = req.user?.userId;
		const classId = req.params.id;
		
		const classData = await classRepo.findById(classId);
		if (!classData) {
			logger.warn({ classId: classId }, "ClassScheduleService - class not found");
			throw new AppError("Class not found", 404);
		}

		let datas = await GMClassScheduleAdapter(userId, classData.external_id);

		if (req.query.date) {
			datas = datas.filter((item: { date: string }) => item.date === req.query.date);
		}

		if (req.query.id) {
			datas = datas.filter((item: { id: number }) => item.id === Number(req.query.id));
		}

		return datas;
	}

	static async getByClassId(data: any) {
		const userId = data.userId;
		const classId = data.classId;
		const scheduleId = data.scheduleId;
		
		const classData = await classRepo.findById(classId);
		if (!classData) {
			logger.warn({ classId: classId }, "ClassScheduleService - class not found");
			throw new AppError("Class not found", 404);
		}

		let datas = await GMClassScheduleAdapter(userId, classData.external_id);

		if (scheduleId) {
			datas = datas.filter((item: { id: number }) => item.id === Number(scheduleId));
		}

		return datas[0];
	}


}
