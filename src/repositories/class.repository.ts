import { asc , eq } from "drizzle-orm";
import { db } from "../database/drizzle.js";
import logger from "../config/logger.js";
import { Class, classSchema } from "../database/schema/class.schema.js";

export const ClassRepository = {
  findAll: async (req: Request): Promise<Class[]> => {
    logger.info("ClassRepository.getAll");
    const result = await db.select().from(classSchema).orderBy(asc(classSchema.external_id));
    return result;
  },

  findById: async (id: string): Promise<Class | null> => {
    logger.info("ClassRepository.getById %o", { id: id });
    const result = await db.select().from(classSchema).where(eq(classSchema.id, id)).limit(1);
    return result[0] || null;
  },
};
