import { ClassRepository } from "../repositories/class.repository.js";

const classRepo = ClassRepository;

export class ClassService {
  	static async getAll(req: Request) {
		const datas = await classRepo.findAll(req);
		return datas;
	}

	static async getDetail(id: string) {
		const datas = await classRepo.findById(id);
		return datas;
	}
}
