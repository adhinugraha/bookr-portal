import { Request, Response } from "express";
import logger from "../config/logger.js";
import { response } from "../core/http/response.js";
import { ClassScheduleService } from "../services/classSchedule.service.js";

export const ClassScheduleController = {
  index: async (req: Request, res: Response) => {
    try {
      logger.info({
        msg: "Incoming class schedules request",
        body: req.body || {},
        path: req.path,
        params: req.params || {},
        query: req.query || {},
        headers: req.headers,
        method: req.method,
      });

      const result = await ClassScheduleService.getAll(req as any);

      return res
        .status(200)
        .json(response(result, "Class schedules fetched successfully"));
      
    } catch (err: any) {
      logger.error({ err }, "ClassSchedulesController.index error");  
	    return res
        .status(err.statusCode || 500)
        .json(response(null, err.message || "Something went wrong" , false));
    }
  }
};
