import { eq } from "drizzle-orm";
import { db } from "../database/drizzle.js";
import {
  externalTokens,
  ExternalToken,
  NewExternalToken
} from "../database/schema/externalTokens.js";
import { logger } from "../config/logger.js";
import { redis } from "../database/redis.js";

export const ExternalTokenRepository = {
  saveToken: async (data: NewExternalToken): Promise<void> => {
    logger.info({ userId: data.userId }, "ExternalTokenRepository.saveToken");

    await db
      .insert(externalTokens)
      .values(data)
      .onConflictDoUpdate({
        target: externalTokens.userId,
        set: {
          accessToken: data.accessToken,
          expires: data.expires,
          updatedAt: new Date(),
        },
      });
      
    await redis.set( `auth:token:${data.userId}`, data.accessToken, "EX", data.expires );
  },

  findByUser: async (userId: number): Promise<ExternalToken | null> => {
    logger.info({ userId }, "ExternalTokenRepository.findByUser");

    const result = await db
      .select()
      .from(externalTokens)
      .where(eq(externalTokens.userId, userId))
      .limit(1);

    return result[0] || null;
  },
};
