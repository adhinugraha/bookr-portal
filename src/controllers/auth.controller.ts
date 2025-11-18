import { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";
import logger from "../config/logger.js";
import { response } from "../core/http/response.js";

export const AuthController = {
  login: async (req: Request, res: Response) => {
    try {
		logger.info({
			msg: "Incoming login request",
			body: req.body || {},
			path: req.path,
			method: req.method,
		});

		const result = await AuthService.login(req.body);

		return res
			.status(200)
			.json(response(result, "Login successful"));
      
    } catch (err: any) {
      logger.error({ err }, "AuthController.login error");
	    return res
        .status(err.statusCode || 500)
        .json(response(null, err.message || "Something went wrong" , false));
    }
  },
  register: async (req: Request, res: Response) => {
    try {
		logger.info({
			msg: "Incoming login request",
			body: req.body || {},
			path: req.path,
			method: req.method,
		});

		const result = await AuthService.register(req.body);

		return res
			.status(200)
			.json(response(result, "Login successful"));
      
    } catch (err: any) {
      logger.error({ err }, "AuthController.login error");
	    return res
        .status(err.statusCode || 500)
        .json(response(null, err.message || "Something went wrong" , false));
    }
  },
};
