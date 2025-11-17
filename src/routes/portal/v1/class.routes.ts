import { Router } from "express";
import { ClassController } from "../../../controllers/class.controller.js";
import { ClassScheduleController } from "../../../controllers/classSchedule.controller.js";

const router = Router();

// GET /portal/v1/api/classes
router.get("/classes", ClassController.index);

// GET /portal/v1/api/classes/:id
router.get("/classes/:id", ClassController.show);

// GET /portal/v1/api/classes/:id/schedules
router.get("/classes/:id/schedules", ClassScheduleController.index);

export default router;

