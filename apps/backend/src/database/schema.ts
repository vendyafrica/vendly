// src/database/schema.ts
import { pgTable, serial, text, varchar, timestamp } from "drizzle-orm/pg-core";

import type { PgTable } from "drizzle-orm/pg-core";

export const users: PgTable = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});


export type User = typeof users.$inferSelect; // selecting
export type NewUser = typeof users.$inferInsert; // inserting
