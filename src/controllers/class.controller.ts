import { Request, Response } from "express";
import logger from "../config/logger.js";
import { response } from "../core/http/response.js";
import { ClassService } from "../services/class.service.js";

export const ClassController = {
  index: async (req: Request, res: Response) => {
    try {
      logger.info({
        msg: "Incoming class request",
        body: req.body || {},
        path: req.path,
        headers: req.headers,
        method: req.method,
      });

      const result = await ClassService.getAll(req as any);

      return res
        .status(200)
        .json(response(result, "Classes fetched successfully"));
      
    } catch (err: any) {
      logger.error({ err }, "ClassController.index error");
	    return res
        .status(err.statusCode || 500)
        .json(response(null, err.message || "Something went wrong" , false));
    }
  },

  show: async (req: Request, res: Response) => {
    try {
      logger.info({
        msg: "Incoming class request",
        body: req.body || {},
        path: req.path,
        params: req.params || {},
        headers: req.headers,
        method: req.method,
      });
      
      const id = req.params["id"] || "";
      const result = await ClassService.getDetail(id);

      return res
        .status(200)
        .json(response(result, "Class detail fetched successfully"));
      
    } catch (err: any) {
      logger.error({ err }, "ClassController.show error");
	    return res
        .status(err.statusCode || 500)
        .json(response(null, err.message || "Something went wrong" , false));
    }
  }
};
