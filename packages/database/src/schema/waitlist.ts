import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const waitlist = pgTable("earlyuser", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  storeName: text("store_name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});