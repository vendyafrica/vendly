import { relations } from "drizzle-orm";
import {
    pgTable,
    text,
    timestamp,
    uuid,
    index,
    unique,
    integer,
} from "drizzle-orm/pg-core";
import { tenants, platformCategories } from "./core-schema";
import { stores } from "./storefront-schema";
import { productCategories } from "./product-schema";

export const categories = pgTable(
    "categories",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        tenantId: uuid("tenant_id")
            .notNull()
            .references(() => tenants.id, { onDelete: "cascade" }),
        storeId: uuid("store_id")
            .notNull()
            .references(() => stores.id, { onDelete: "cascade" }),
        platformCategoryId: uuid("platform_category_id")
            .references(() => platformCategories.id, { onDelete: "set null" }),

        name: text("name").notNull(),
        slug: text("slug").notNull(),
        imageUrl: text("image_url"), 
        description: text("description"),
        sortOrder: integer("sort_order"),

        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        unique("categories_store_slug_unique").on(table.storeId, table.slug),
        index("categories_tenant_idx").on(table.tenantId),
        index("categories_store_idx").on(table.storeId),
        index("categories_platform_category_idx").on(table.platformCategoryId),
    ]
);

export const categoriesRelations = relations(categories, ({ one, many }) => ({
    store: one(stores, {
        fields: [categories.storeId],
        references: [stores.id],
    }),
    tenant: one(tenants, {
        fields: [categories.tenantId],
        references: [tenants.id],
    }),
    platformCategory: one(platformCategories, {
        fields: [categories.platformCategoryId],
        references: [platformCategories.id],
    }),
    productCategories: many(productCategories),
}));

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
