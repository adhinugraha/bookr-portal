import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";

import { users } from "./users.js";
import { relations } from "drizzle-orm";

export const externalTokens = pgTable("external_tokens", {
  id: serial("id").primaryKey(),

  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
    
  accessToken: varchar("token", { length: 500 }).notNull(),
  expires: integer("expires").default(0).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const externalTokensRelations = relations(
  externalTokens,
  ({ one }) => ({
    user: one(users, {
      fields: [externalTokens.userId],
      references: [users.id],
    }),
  })
);

// --- Type inference ---
export type ExternalToken = typeof externalTokens.$inferSelect;     // SELECT
export type NewExternalToken = typeof externalTokens.$inferInsert;  // INSERT
