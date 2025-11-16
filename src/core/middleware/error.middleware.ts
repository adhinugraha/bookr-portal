import { Request, Response, NextFunction } from "express";
import logger from "../../config/logger.js";

export function errorMiddleware(err: any, req: Request, res: Response, _next: NextFunction) {
  logger.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
}
