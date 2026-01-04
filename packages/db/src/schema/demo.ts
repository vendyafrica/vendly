import {
  pgTable,
  text,
  timestamp,
  uuid,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const demo = pgTable(
  "demo",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    name: text("name").notNull(),

    subdomain: text("subdomain").notNull(),

    category: text("category").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    subdomainIdx: uniqueIndex("demo_subdomain_idx").on(table.subdomain),
  })
);
