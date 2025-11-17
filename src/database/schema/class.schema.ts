import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";

export const classSchema = pgTable("classes", {
  id: uuid("id").primaryKey().defaultRandom(),

  name: varchar("name", { length: 255 }).notNull(),
  description: varchar("description").default(null),
  image: varchar("image").default(null),
  
  external_id: integer("external_id").default(0).notNull(),

  status: integer("status").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").default(null),
});

// --- Type inference ---
export type Class = typeof classSchema.$inferSelect;     // For SELECT
export type NewClass = typeof classSchema.$inferInsert;  // For INSERT
