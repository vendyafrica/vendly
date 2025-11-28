import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const waitlist = pgTable("waitlist", {
  id: serial("id").primaryKey(),
  storeName: text("store_name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export interface Waitlist {
  storeName: string;
}