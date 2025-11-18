import { asc , desc, eq, sql } from "drizzle-orm";
import { db } from "../database/drizzle.js";
import logger from "../config/logger.js";
import { Invoice, invoiceSchema, NewInvoice } from "../database/schema/invoice.schema.js";
import { Payment, paymentSchema } from "../database/schema/payment.schema.js";
import { Booking, bookingSchema } from "../database/schema/booking.schema.js";
import { Class, classSchema } from "../database/schema/class.schema.js";

export const InvoiceRepository = {
  findAll: async (req: Request): Promise<Invoice[]> => {
    logger.info("InvoiceRepository.getAll");
    const result = await db.select().from(invoiceSchema).orderBy(desc(invoiceSchema.createdAt));
    return result;
  },

  findById: async (id: string): Promise<Invoice | null> => {
    logger.info("InvoiceRepository.getById %o", { id: id });
    const result = await db.select().from(invoiceSchema).where(eq(invoiceSchema.id, id)).limit(1);
    return result[0] || null;
  },

  findByBookingId: async (id: string): Promise<{ invoice: Invoice; payment: Payment; booking: Booking; class: Class| null } | null> => {
    logger.info("InvoiceRepository.getByBookingId %o", { id });
    const result = await db
      .select({
        invoice: invoiceSchema,
        payment: paymentSchema,
        booking: bookingSchema,
        class: classSchema
      })
      .from(invoiceSchema)
      .leftJoin(paymentSchema, eq(paymentSchema.id, invoiceSchema.paymentId))
      .leftJoin(bookingSchema, eq(bookingSchema.id, invoiceSchema.bookingId))
      .leftJoin(classSchema, eq(classSchema.id, bookingSchema.classId))
      .where(eq(invoiceSchema.id, id))
      .limit(1);
    return result[0] || null;
  },

  create: async (invoice: NewInvoice): Promise<Invoice> => {
    logger.info("InvoiceRepository.create %o", { invoice: invoice }); 
    const result = await db.insert(invoiceSchema).values(invoice).returning();
    return result[0];
  },

  update: async (id: string, invoice: NewInvoice): Promise<Invoice> => {
    logger.info("InvoiceRepository.update %o", { id: id, invoice: invoice });
    const result = await db.update(invoiceSchema).set(invoice).where(eq(invoiceSchema.id, id)).returning();
    return result[0];
  },

  findLatest: async (): Promise<number> => {
    logger.info("InvoiceRepository.findLatest");
    const result = await db.select({ count: sql<number>`count(*)` }).from(invoiceSchema);
    return result[0].count;
  },
};
