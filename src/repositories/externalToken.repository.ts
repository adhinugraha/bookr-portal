import { eq } from "drizzle-orm";
import { db } from "../database/drizzle.js";
import {
  externalTokenSchema,
  ExternalToken,
  NewExternalToken
} from "../database/schema/externalToken.schema.js";
import logger from "../config/logger.js";
import { redis } from "../database/redis.js";

export const ExternalTokenRepository = {
  saveToken: async (data: NewExternalToken): Promise<void> => {
    logger.info({ userId: data.userId }, "ExternalTokenRepository.saveToken");

    await db
      .insert(externalTokenSchema)
      .values(data)
      .onConflictDoUpdate({
        target: externalTokenSchema.userId,
        set: {
          accessToken: data.accessToken,
          expires: data.expires,
          updatedAt: new Date(),
        },
      });
      
    await redis.set( `auth:token:${data.userId}`, data.accessToken, "EX", data.expires );
  },

  findByUser: async (userId: string): Promise<ExternalToken | null> => {
    logger.info({ userId }, "ExternalTokenRepository.findByUser");

    const result = await db
      .select()
      .from(externalTokenSchema)
      .where(eq(externalTokenSchema.userId, userId))
      .limit(1);

    return result[0] || null;
  },

  create: async (externalToken: NewExternalToken): Promise<ExternalToken | null> => {
    logger.info("ExternalTokenRepository.create %o", { externalToken: externalToken });
    const result = await db.insert(externalTokenSchema).values(externalToken).returning();
    return result[0];
  },
};
