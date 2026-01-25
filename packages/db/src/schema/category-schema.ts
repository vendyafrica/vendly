import { relations } from "drizzle-orm";
import {
    pgTable,
    text,
    timestamp,
    uuid,
    index,
    unique,
    integer,
    foreignKey,
} from "drizzle-orm/pg-core";
import { stores } from "./storefront-schema";

export const categories = pgTable(
    "categories",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        name: text("name").notNull(),
        slug: text("slug").notNull().unique(),
        image: text("image"),
        parentId: uuid("parent_id"),
        level: integer("level").default(0).notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        index("categories_parent_idx").on(table.parentId),
        foreignKey({
            columns: [table.parentId],
            foreignColumns: [table.id],
            name: "categories_parent_id_fk",
        }).onDelete("set null"),
        index("categories_slug_idx").on(table.slug),
    ]
);

export const categoriesRelations = relations(categories, ({ one, many }) => ({
    parent: one(categories, {
        fields: [categories.parentId],
        references: [categories.id],
        relationName: "parent_child",
    }),
    children: many(categories, {
        relationName: "parent_child",
    }),
    storeCategories: many(storeCategories),
}));

export const storeCategories = pgTable(
    "store_categories",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        storeId: uuid("store_id")
            .notNull()
            .references(() => stores.id, { onDelete: "cascade" }),
        categoryId: uuid("category_id")
            .notNull()
            .references(() => categories.id, { onDelete: "cascade" }),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => [
        unique("store_categories_unique").on(table.storeId, table.categoryId),
        index("store_categories_store_idx").on(table.storeId),
        index("store_categories_category_idx").on(table.categoryId),
    ]
);

export const storeCategoriesRelations = relations(storeCategories, ({ one }) => ({
    store: one(stores, {
        fields: [storeCategories.storeId],
        references: [stores.id],
    }),
    category: one(categories, {
        fields: [storeCategories.categoryId],
        references: [categories.id],
    }),
}));

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type StoreCategory = typeof storeCategories.$inferSelect;
export type NewStoreCategory = typeof storeCategories.$inferInsert;
