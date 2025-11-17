import {
  pgTable,
  uuid,
  timestamp,
  integer,
  varchar,
} from "drizzle-orm/pg-core";
import { userSchema } from "./user.schema.js";
import { relations } from "drizzle-orm";
import { bookingSchema } from "./booking.schema.js";
import { paymentSchema } from "./payment.schema.js";

export const invoiceSchema = pgTable("invoices", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 255 }).notNull(),
  amount: integer("amount").default(0).notNull(),
  
  userId: uuid("user_id")
      .notNull()
      .references(() => userSchema.id, { onDelete: "cascade" }),
  bookingId: uuid("booking_id")
      .notNull()
      .references(() => bookingSchema.id, { onDelete: "cascade" }),
  paymentId: uuid("payment_id")
      .notNull()
      .references(() => paymentSchema.id, { onDelete: "cascade" }),

  status: integer("status").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").default(null),
  issuedAt: timestamp("issued_at").default(null),
});

export const invoiceSchemaRelations = relations(
  invoiceSchema,
  ({ one }) => ({
    user: one(userSchema, {
      fields: [invoiceSchema.userId],
      references: [userSchema.id],
    }),
    booking: one(bookingSchema, {
      fields: [invoiceSchema.bookingId],
      references: [bookingSchema.id],
    }),
    payment: one(paymentSchema, {
      fields: [invoiceSchema.paymentId],
      references: [paymentSchema.id],
    }),
  })
);

// --- Type inference ---
export type Invoice = typeof invoiceSchema.$inferSelect;     // For SELECT
export type NewInvoice = typeof invoiceSchema.$inferInsert;  // For INSERT
