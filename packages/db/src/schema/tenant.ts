import type { InferSelectModel } from "drizzle-orm";
import { pgTable, text, timestamp, uuid, uniqueIndex, jsonb } from "drizzle-orm/pg-core";

export const tenants = pgTable(
  "tenants",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull(),
    status: text("status").notNull().default("creating"),
    storefrontConfig: jsonb("storefront_config"),
    demoUrl: text("demo_url"), // v0 generated preview URL for iframe embedding
    v0ChatId: text("v0_chat_id"), // v0 chat ID for future updates
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
