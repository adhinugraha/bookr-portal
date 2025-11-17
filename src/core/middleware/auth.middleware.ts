import { NextFunction, Response } from "express";
import { jwtVerify } from "jose";
import { config } from "../../config/env.js";
import logger from "../../config/logger.js";
import { AppError } from "../http/error.js";
import type { AuthRequest, JwtPayload } from "../../types/index.js";

const encoder = new TextEncoder();

export const AuthMiddleware = {
  verifyToken: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new AppError("Unauthorized", 401);
      }

      const token = authHeader.split(" ")[1];

      const { payload } = await jwtVerify(token, encoder.encode(config.JWT_SECRET));
      const jwtPayload = payload as unknown as JwtPayload;

      if (!jwtPayload || !jwtPayload.userId) {
        throw new AppError("Forbidden", 403);
      }

      req.user = {
        userId: jwtPayload.userId,
        email: jwtPayload.email,
        role: jwtPayload.role ?? "member",
        externalId: jwtPayload.externalId,
      };

      next();
    } catch (err: any) {
      logger.error({ err }, "JWT verification failed");
      return res.status(err.statusCode || err.status || 401).json({
        status: "error",
        message: "Authorize token expired or invalid",
      });
    }
  },
};