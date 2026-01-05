import type { InferSelectModel } from "drizzle-orm";
import { pgTable, text, timestamp, uuid, uniqueIndex, jsonb } from "drizzle-orm/pg-core";

export const tenants = pgTable(
  "tenants",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull(),
    status: text("status").notNull().default("creating"),
    storefrontConfig: jsonb("storefront_config"),
    error: text("error"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => ({
    slugIdx: uniqueIndex("tenants_slug_idx").on(table.slug),
  })
);

export type Tenant = InferSelectModel<typeof tenants>;
