import { eq } from "drizzle-orm";
import { db } from "../database/drizzle.js";
import { userSchema, User, NewUser } from "../database/schema/user.schema.js";
import logger from "../config/logger.js";

export const UserRepository = {
  findByEmail: async (email: string): Promise<User | null> => {
    logger.info({ email }, "UserRepository.findByEmail");

    const result = await db.select().from(userSchema).where(eq(userSchema.email, email)).limit(1);
    return result[0] || null;
  },

  findById: async (id: string): Promise<User | null> => {
    logger.info({ id }, "UserRepository.findById");

    const result = await db.select().from(userSchema).where(eq(userSchema.id, id)).limit(1);
    return result[0] || null;
  },

  updateExternalId: async (userId: string, externalId: number): Promise<void> => {
    logger.info({ userId, externalId }, "UserRepository.updateExternalId");

    await db
      .update(userSchema)
      .set({
        externalId,
        updatedAt: new Date(),
      })
      .where(eq(userSchema.id, userId));
  },

  create: async (user: NewUser): Promise<User | null> => {
    logger.info("UserRepository.create %o", { user: user });
    const result = await db.insert(userSchema).values(user).returning();
    return result[0];
  },
};
