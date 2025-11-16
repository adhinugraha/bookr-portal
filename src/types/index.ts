import type { Request } from "express";

export interface JwtPayload {
  userId: string;
  email: string;
  externalId?: number;
}

export type { JwtPayload as JwtPayloadType };