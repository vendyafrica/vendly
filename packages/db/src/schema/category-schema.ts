import { relations } from "drizzle-orm";
import {
    pgTable,
    timestamp,
    uuid,
    text,
    integer,
    index,
    unique,
    boolean,
    primaryKey,
} from "drizzle-orm/pg-core";

import { tenants } from "./tenant-schema";
import { stores } from "./storefront-schema";
import { products } from "./product-schema";

/**
 * Store Categories
 * Tenant-specific categories for each store.
 * Simplified hierarchy with parent_id.
 */
export const storeCategories = pgTable(
    "store_categories",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        tenantId: uuid("tenant_id")
            .notNull()
            .references(() => tenants.id, { onDelete: "cascade" }),
        storeId: uuid("store_id")
            .notNull()
            .references(() => stores.id, { onDelete: "cascade" }),

        name: text("name").notNull(),
        slug: text("slug").notNull(),
        description: text("description"),
        imageUrl: text("image_url"),  // Can be from mediaObjects or direct URL

        // Hierarchy (optional parent for subcategories)
        parentId: uuid("parent_id"),  // Self-reference handled in relations or separate constraint if needed, but simple FK here requires circularity handling in table definition which Drizzle supports via callback

        sortOrder: integer("sort_order").default(0).notNull(),
        isVisible: boolean("is_visible").default(true).notNull(),

        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        unique("store_categories_store_slug_unique").on(table.storeId, table.slug),
        index("store_categories_tenant_idx").on(table.tenantId),
        index("store_categories_store_idx").on(table.storeId),
        index("store_categories_parent_idx").on(table.parentId),
        // Add foreign key for parentId manually if needed or rely on application logic/separate alter
    ]
);

// Junction table for many-to-many relationship
export const productCategories = pgTable(
    "product_categories",
    {
        productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
        categoryId: uuid("category_id").notNull().references(() => storeCategories.id, { onDelete: "cascade" }),
    },
    (table) => [
        primaryKey({ columns: [table.productId, table.categoryId] }),
        index("product_categories_product_idx").on(table.productId),
        index("product_categories_category_idx").on(table.categoryId),
    ]
);

// Relations
export const storeCategoriesRelations = relations(
    storeCategories,
    ({ one, many }) => ({
        tenant: one(tenants, {
            fields: [storeCategories.tenantId],
            references: [tenants.id],
        }),
        store: one(stores, {
            fields: [storeCategories.storeId],
            references: [stores.id],
        }),
        parent: one(storeCategories, {
            fields: [storeCategories.parentId],
            references: [storeCategories.id],
            relationName: "category_hierarchy"
        }),
        children: many(storeCategories, { relationName: "category_hierarchy" }),
        productCategories: many(productCategories),
    })
);

export const productCategoriesRelations = relations(productCategories, ({ one }) => ({
    product: one(products, {
        fields: [productCategories.productId],
        references: [products.id],
    }),
    category: one(storeCategories, {
        fields: [productCategories.categoryId],
        references: [storeCategories.id],
    }),
}));

// Typed exports
export type StoreCategory = typeof storeCategories.$inferSelect;
export type NewStoreCategory = typeof storeCategories.$inferInsert;

export type ProductCategory = typeof productCategories.$inferSelect;
export type NewProductCategory = typeof productCategories.$inferInsert;