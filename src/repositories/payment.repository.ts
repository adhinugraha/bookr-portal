import { asc , eq } from "drizzle-orm";
import { db } from "../database/drizzle.js";
import logger from "../config/logger.js";
import { Payment, paymentSchema, NewPayment } from "../database/schema/payment.schema.js";

export const PaymentRepository = {
  findAll: async (req: Request): Promise<Payment[]> => {
    logger.info("PaymentRepository.getAll");
    const result = await db.select().from(paymentSchema).orderBy(asc(paymentSchema.createdAt));
    return result;
  },

  findById: async (id: string): Promise<Payment | null> => {
    logger.info("PaymentRepository.getById %o", { id: id });
    const result = await db.select().from(paymentSchema).where(eq(paymentSchema.id, id)).limit(1);
    return result[0] || null;
  },

  create: async (payment: NewPayment): Promise<Payment> => {
    logger.info("PaymentRepository.create %o", { payment: payment });
    const result = await db.insert(paymentSchema).values(payment).returning();
    return result[0];
  },

  update: async (id: string, payment: NewPayment): Promise<Payment> => {
    logger.info("PaymentRepository.update %o", { id: id, payment: payment });
    const result = await db.update(paymentSchema).set(payment).where(eq(paymentSchema.id, id)).returning();
    return result[0];
  },
};
