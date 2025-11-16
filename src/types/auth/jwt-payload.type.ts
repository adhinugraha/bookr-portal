export interface JwtPayload {
  userId: string;
  email: string;
  externalId?: number;
}