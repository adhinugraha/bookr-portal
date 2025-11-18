import { asc , eq } from "drizzle-orm";
import { db } from "../database/drizzle.js";
import logger from "../config/logger.js";
import { Booking, bookingSchema, NewBooking } from "../database/schema/booking.schema.js";
import { Class, classSchema } from "../database/schema/class.schema.js";

export const BookingRepository = {
  findAll: async (req: Request): Promise<Booking[]> => {
    logger.info("BookingRepository.getAll");
    const result = await db.select().from(bookingSchema).orderBy(asc(bookingSchema.externalId));
    return result;
  },

  findById: async (id: string): Promise<Booking | null> => {
    logger.info("BookingRepository.getById %o", { id: id });
    const result = await db.select().from(bookingSchema).where(eq(bookingSchema.id, id)).limit(1);
    return result[0] || null;
  },

  findByIdWithClass: async (id: string): Promise<{ booking: Booking; class: Class | null } | null> => {
    logger.info("BookingRepository.getById %o", { id: id });
    const result = await db
      .select({
        booking: bookingSchema,
        class: classSchema
      })
      .from(bookingSchema)
      .leftJoin(classSchema, eq(classSchema.id, bookingSchema.classId))
      .where(eq(bookingSchema.id, id))
      .limit(1);
    return result[0] || null;
  },

  create: async (booking: NewBooking): Promise<Booking> => {
    logger.info("BookingRepository.create %o", { booking: booking });
    const result = await db.insert(bookingSchema).values(booking).returning();
    return result[0];
  },

  update: async (id: string, booking: NewBooking): Promise<Booking> => {
    logger.info("BookingRepository.update %o", { id: id, booking: booking });
    const result = await db.update(bookingSchema).set(booking).where(eq(bookingSchema.id, id)).returning();
    return result[0];
  },
};
