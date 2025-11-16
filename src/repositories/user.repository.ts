import { eq } from "drizzle-orm";
import { db } from "../database/drizzle.js";
import { users, User } from "../database/schema/users.js";
import { logger } from "../config/logger.js";

export const UserRepository = {
  findByEmail: async (email: string): Promise<User | null> => {
    logger.info({ email }, "UserRepository.findByEmail");

    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0] || null;
  },

  findById: async (id: number): Promise<User | null> => {
    logger.info({ id }, "UserRepository.findById");

    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0] || null;
  },

  updateExternalId: async (userId: number, externalId: number): Promise<void> => {
    logger.info({ userId, externalId }, "UserRepository.updateExternalId");

    await db
      .update(users)
      .set({
        externalId,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  },
};
