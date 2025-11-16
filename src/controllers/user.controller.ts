import { Request, Response } from "express";
import { logger } from "../config/logger.js";
import { response } from "../core/http/response.js";
import { UserService } from "../services/user.service.js";

export const UserController = {
  show: async (req: Request, res: Response) => {
    try {
      logger.info({
        msg: "Incoming user request",
        body: req.body || {},
        path: req.path,
        headers: req.headers,
        method: req.method,
      });

      const result = await UserService.getProfile(req as any);

      return res
        .status(200)
        .json(response(result, "User detail fetched successfully"));
      
    } catch (err: any) {
      logger.error({ err }, "UserController.show error");
	    return res
        .status(err.statusCode || 500)
        .json(response(null, err.message || "Something went wrong" , false));
    }
  }
};
