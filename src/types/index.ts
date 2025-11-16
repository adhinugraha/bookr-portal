import type { Request } from "express";

export interface JwtPayload {
  userId: string;
  email: string;
  role?: string;
  externalId?: number;
}

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role?: string;
    externalId?: number;
  };
}

export type { JwtPayload as JwtPayloadType };