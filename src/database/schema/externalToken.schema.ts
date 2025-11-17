import {
  pgTable,
  varchar,
  timestamp,
  integer,
  uuid,
  serial,
} from "drizzle-orm/pg-core";

import { userSchema } from "./user.schema.js";
import { relations } from "drizzle-orm";

export const externalTokenSchema = pgTable("external_tokens", {
  id: serial("id").primaryKey(),

  userId: uuid("user_id")
    .notNull()
    .references(() => userSchema.id, { onDelete: "cascade" }),
    
  accessToken: varchar("token", { length: 500 }).notNull(),
  expires: integer("expires").default(0).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").default(null),
});

export const externalTokenSchemaRelations = relations(
  externalTokenSchema,
  ({ one }) => ({
    user: one(userSchema, {
      fields: [externalTokenSchema.userId],
      references: [userSchema.id],
    }),
  })
);

// --- Type inference ---
export type ExternalToken = typeof externalTokenSchema.$inferSelect;     // SELECT
export type NewExternalToken = typeof externalTokenSchema.$inferInsert;  // INSERT
