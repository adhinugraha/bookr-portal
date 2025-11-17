import {
  pgTable,
  uuid,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";
import { userSchema } from "./user.schema.js";
import { relations } from "drizzle-orm";
import { classSchema } from "./class.schema.js";

export const bookingSchema = pgTable("bookings", {
  id: uuid("id").primaryKey().defaultRandom(),

  userId: uuid("user_id")
      .notNull()
      .references(() => userSchema.id, { onDelete: "cascade" }),
  
  externalId: integer("external_id").default(0).notNull(),
  classId: uuid("class_id")
      .notNull()
      .references(() => classSchema.id, { onDelete: "cascade" }),
  scheduleId: integer("schedule_id").default(0).notNull(),

  status: integer("status").default(0).notNull(),
  paid: integer("paid").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").default(null),
});

export const bookingSchemaRelations = relations(
  bookingSchema,
  ({ one }) => ({
    user: one(userSchema, {
      fields: [bookingSchema.userId],
      references: [userSchema.id],
    }),
    class: one(classSchema, {
      fields: [bookingSchema.classId],
      references: [classSchema.id],
    }),
  })
);

// --- Type inference ---
export type Booking = typeof bookingSchema.$inferSelect;     // For SELECT
export type NewBooking = typeof bookingSchema.$inferInsert;  // For INSERT
