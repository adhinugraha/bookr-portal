import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
  uuid,
} from "drizzle-orm/pg-core";

export const userSchema = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),

  email: varchar("email", { length: 255 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  phoneNumber: varchar("phone_number", { length: 255 }),

  externalId: integer("external_id").default(0).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").default(null),
});

// --- Type inference ---
export type User = typeof userSchema.$inferSelect;     // For SELECT
export type NewUser = typeof userSchema.$inferInsert;  // For INSERT
