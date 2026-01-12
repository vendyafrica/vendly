// import { relations } from "drizzle-orm";
// import {
//     pgTable,
//     timestamp,
//     uuid,
//     text,
//     integer,
//     index,
//     unique,
// } from "drizzle-orm/pg-core";

// // Import related tables
// import { tenants } from "./tenant-schema";
// import { stores } from "./storefront-schema";
// import { productCategories } from "./product-schema";

// /**
//  * Platform Categories
//  * Global top-level categories that all tenants can reference.
//  * These are the major category types (e.g., Electronics, Clothing, Food).
//  */
// export const platformCategories = pgTable(
//     "platform_categories",
//     {
//         id: uuid("id").primaryKey().defaultRandom(),
//         name: text("name").notNull(),
//         slug: text("slug").notNull().unique(),
//         imageUrl: text("image_url"),
//         description: text("description"),
//         sortOrder: integer("sort_order"),
//         createdAt: timestamp("created_at").defaultNow().notNull(),
//         updatedAt: timestamp("updated_at")
//             .defaultNow()
//             .$onUpdate(() => new Date())
//             .notNull(),
//     },
//     (table) => [
//         index("platform_categories_slug_idx").on(table.slug),
//     ]
// );

// /**
//  * Platform Subcategories
//  * Predefined subcategories that belong to platform categories.
//  * These provide standard subcategory options (e.g., Smartphones under Electronics).
//  */
// export const platformSubcategories = pgTable(
//     "platform_subcategories",
//     {
//         id: uuid("id").primaryKey().defaultRandom(),
//         platformCategoryId: uuid("platform_category_id")
//             .notNull()
//             .references(() => platformCategories.id, { onDelete: "cascade" }),
//         name: text("name").notNull(),
//         slug: text("slug").notNull(),
//         imageUrl: text("image_url"),
//         description: text("description"),
//         sortOrder: integer("sort_order"),
//         createdAt: timestamp("created_at").defaultNow().notNull(),
//         updatedAt: timestamp("updated_at")
//             .defaultNow()
//             .$onUpdate(() => new Date())
//             .notNull(),
//     },
//     (table) => [
//         unique("platform_subcategories_category_slug_unique").on(
//             table.platformCategoryId,
//             table.slug
//         ),
//         index("platform_subcategories_category_idx").on(table.platformCategoryId),
//     ]
// );

// /**
//  * Store Categories
//  * Tenant-specific categories for each store.
//  * Links to platform categories but can have custom names and subcategories.
//  */
// export const storeCategories = pgTable(
//     "store_categories",
//     {
//         id: uuid("id").primaryKey().defaultRandom(),
//         tenantId: uuid("tenant_id")
//             .notNull()
//             .references(() => tenants.id, { onDelete: "cascade" }),
//         storeId: uuid("store_id")
//             .notNull()
//             .references(() => stores.id, { onDelete: "cascade" }),
//         platformCategoryId: uuid("platform_category_id")
//             .references(() => platformCategories.id, { onDelete: "set null" }),
        
//         name: text("name").notNull(),
//         slug: text("slug").notNull(),
//         imageUrl: text("image_url"),
//         description: text("description"),
//         sortOrder: integer("sort_order"),
        
//         createdAt: timestamp("created_at").defaultNow().notNull(),
//         updatedAt: timestamp("updated_at")
//             .defaultNow()
//             .$onUpdate(() => new Date())
//             .notNull(),
//     },
//     (table) => [
//         unique("store_categories_store_slug_unique").on(table.storeId, table.slug),
//         index("store_categories_tenant_idx").on(table.tenantId),
//         index("store_categories_store_idx").on(table.storeId),
//         index("store_categories_platform_category_idx").on(table.platformCategoryId),
//     ]
// );

// /**
//  * Store Subcategories
//  * Custom subcategories for each store category.
//  * Can reference platform subcategories or be completely custom.
//  */
// export const storeSubcategories = pgTable(
//     "store_subcategories",
//     {
//         id: uuid("id").primaryKey().defaultRandom(),
//         tenantId: uuid("tenant_id")
//             .notNull()
//             .references(() => tenants.id, { onDelete: "cascade" }),
//         storeId: uuid("store_id")
//             .notNull()
//             .references(() => stores.id, { onDelete: "cascade" }),
//         storeCategoryId: uuid("store_category_id")
//             .notNull()
//             .references(() => storeCategories.id, { onDelete: "cascade" }),
//         platformSubcategoryId: uuid("platform_subcategory_id")
//             .references(() => platformSubcategories.id, { onDelete: "set null" }),
        
//         name: text("name").notNull(),
//         slug: text("slug").notNull(),
//         imageUrl: text("image_url"),
//         description: text("description"),
//         sortOrder: integer("sort_order"),
        
//         createdAt: timestamp("created_at").defaultNow().notNull(),
//         updatedAt: timestamp("updated_at")
//             .defaultNow()
//             .$onUpdate(() => new Date())
//             .notNull(),
//     },
//     (table) => [
//         unique("store_subcategories_category_slug_unique").on(
//             table.storeCategoryId,
//             table.slug
//         ),
//         index("store_subcategories_tenant_idx").on(table.tenantId),
//         index("store_subcategories_store_idx").on(table.storeId),
//         index("store_subcategories_category_idx").on(table.storeCategoryId),
//         index("store_subcategories_platform_subcategory_idx").on(
//             table.platformSubcategoryId
//         ),
//     ]
// );

// // Relations
// export const platformCategoriesRelations = relations(
//     platformCategories,
//     ({ many }) => ({
//         platformSubcategories: many(platformSubcategories),
//         storeCategories: many(storeCategories),
//     })
// );

// export const platformSubcategoriesRelations = relations(
//     platformSubcategories,
//     ({ one, many }) => ({
//         platformCategory: one(platformCategories, {
//             fields: [platformSubcategories.platformCategoryId],
//             references: [platformCategories.id],
//         }),
//         storeSubcategories: many(storeSubcategories),
//     })
// );

// export const storeCategoriesRelations = relations(
//     storeCategories,
//     ({ one, many }) => ({
//         tenant: one(tenants, {
//             fields: [storeCategories.tenantId],
//             references: [tenants.id],
//         }),
//         store: one(stores, {
//             fields: [storeCategories.storeId],
//             references: [stores.id],
//         }),
//         platformCategory: one(platformCategories, {
//             fields: [storeCategories.platformCategoryId],
//             references: [platformCategories.id],
//         }),
//         subcategories: many(storeSubcategories),
//         productCategories: many(productCategories),
//     })
// );

// export const storeSubcategoriesRelations = relations(
//     storeSubcategories,
//     ({ one, many }) => ({
//         tenant: one(tenants, {
//             fields: [storeSubcategories.tenantId],
//             references: [tenants.id],
//         }),
//         store: one(stores, {
//             fields: [storeSubcategories.storeId],
//             references: [stores.id],
//         }),
//         storeCategory: one(storeCategories, {
//             fields: [storeSubcategories.storeCategoryId],
//             references: [storeCategories.id],
//         }),
//         platformSubcategory: one(platformSubcategories, {
//             fields: [storeSubcategories.platformSubcategoryId],
//             references: [platformSubcategories.id],
//         }),
//         productCategories: many(productCategories),
//     })
// );

// // Typed exports
// export type PlatformCategory = typeof platformCategories.$inferSelect;
// export type NewPlatformCategory = typeof platformCategories.$inferInsert;

// export type PlatformSubcategory = typeof platformSubcategories.$inferSelect;
// export type NewPlatformSubcategory = typeof platformSubcategories.$inferInsert;

// export type StoreCategory = typeof storeCategories.$inferSelect;
// export type NewStoreCategory = typeof storeCategories.$inferInsert;

// export type StoreSubcategory = typeof storeSubcategories.$inferSelect;
// export type NewStoreSubcategory = typeof storeSubcategories.$inferInsert;