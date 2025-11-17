import {
  pgTable,
  uuid,
  timestamp,
  integer,
  varchar,
} from "drizzle-orm/pg-core";

export const paymentSchema = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  amount: integer("amount").default(0).notNull(),
  paymentRefId: varchar("payment_ref_id", { length: 255 }),
  paymentReqId: varchar("payment_req_id", { length: 255 }),
  paymentPrefix: varchar("payment_prefix", { length: 255 }),
  issuer: varchar("issuer", { length: 255 }),
  status: integer("status").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").default(null),
  issuedAt: timestamp("issued_at").default(null),
});

// --- Type inference ---
export type Payment = typeof paymentSchema.$inferSelect;     // For SELECT
export type NewPayment = typeof paymentSchema.$inferInsert;  // For INSERT
