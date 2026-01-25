import { relations } from "drizzle-orm";
import {
    pgTable,
    text,
    jsonb,
    timestamp,
    uuid,
    integer,
    boolean,
    index,
    unique,
} from "drizzle-orm/pg-core";

import { tenants } from "./tenant-schema";
import { stores } from "./storefront-schema";
import { mediaObjects } from "./media-schema";

export const products = pgTable(
    "products",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        tenantId: uuid("tenant_id")
            .notNull()
            .references(() => tenants.id, { onDelete: "cascade" }),
        storeId: uuid("store_id")
            .notNull()
            .references(() => stores.id, { onDelete: "cascade" }),

        productName: text("product_name").notNull(),
        priceAmount: integer("price_amount").notNull().default(0),
        currency: text("currency").notNull().default("KES"),
        quantity: integer("quantity").notNull().default(0),

        status: text("status").notNull().default("draft"),
        rating: integer("rating").default(0),
        ratingCount: integer("rating_count").default(0),

        source: text("source").notNull().default("manual"),
        sourceId: text("source_id"),
        sourceUrl: text("source_url"),

        isFeatured: boolean("is_featured").default(false),
        hasContentVariants: boolean("has_content_variants").default(false),

        viewCount: integer("view_count").default(0).notNull(),

        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
        deletedAt: timestamp("deleted_at"),
    },
    (table) => [
        index("products_tenant_store_idx").on(table.tenantId, table.storeId),
        index("products_status_idx").on(table.status),
    ]
);

export const productVariants = pgTable(
    "product_variants",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        tenantId: uuid("tenant_id")
            .notNull()
            .references(() => tenants.id, { onDelete: "cascade" }),
        productId: uuid("product_id")
            .notNull()
            .references(() => products.id, { onDelete: "cascade" }),

        variantName: text("variant_name"),
        priceAmount: integer("price_amount").notNull(),
        currency: text("currency").default("KES"),
        quantity: integer("quantity").notNull().default(0),

        options: jsonb("options").$type<{ size?: string; color?: string }>(),

        isActive: boolean("is_active").default(true),
        sortOrder: integer("sort_order").default(0),

        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        index("product_variants_product_idx").on(table.productId),
    ]
);

export const productMedia = pgTable(
    "product_media",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        tenantId: uuid("tenant_id")
            .notNull()
            .references(() => tenants.id, { onDelete: "cascade" }),
        productId: uuid("product_id")
            .notNull()
            .references(() => products.id, { onDelete: "cascade" }),
        mediaId: uuid("media_id")
            .notNull()
            .references(() => mediaObjects.id, { onDelete: "cascade" }),

        variantId: uuid("variant_id")
            .references(() => productVariants.id, { onDelete: "set null" }),

        sortOrder: integer("sort_order").default(0).notNull(),
        isFeatured: boolean("is_featured").default(false).notNull(),

        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => [
        index("product_media_product_idx").on(table.productId),
        index("product_media_media_idx").on(table.mediaId),
        index("product_media_sort_idx").on(table.productId, table.sortOrder),
    ]
);

export const mediaObjectsRelations = relations(mediaObjects, ({ one, many }) => ({
    tenant: one(tenants, {
        fields: [mediaObjects.tenantId],
        references: [tenants.id],
    }),
    productMedia: many(productMedia),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
    tenant: one(tenants, {
        fields: [products.tenantId],
        references: [tenants.id],
    }),
    store: one(stores, {
        fields: [products.storeId],
        references: [stores.id],
    }),
    variants: many(productVariants),
    media: many(productMedia),
}));

export const productVariantsRelations = relations(productVariants, ({ one, many }) => ({
    tenant: one(tenants, {
        fields: [productVariants.tenantId],
        references: [tenants.id],
    }),
    product: one(products, {
        fields: [productVariants.productId],
        references: [products.id],
    }),
    media: many(productMedia),
}));

export const productMediaRelations = relations(productMedia, ({ one }) => ({
    tenant: one(tenants, {
        fields: [productMedia.tenantId],
        references: [tenants.id],
    }),
    product: one(products, {
        fields: [productMedia.productId],
        references: [products.id],
    }),
    media: one(mediaObjects, {
        fields: [productMedia.mediaId],
        references: [mediaObjects.id],
    }),
    variant: one(productVariants, {
        fields: [productMedia.variantId],
        references: [productVariants.id],
    }),
}));



export type MediaObject = typeof mediaObjects.$inferSelect;
export type NewMediaObject = typeof mediaObjects.$inferInsert;

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type ProductVariant = typeof productVariants.$inferSelect;
export type NewProductVariant = typeof productVariants.$inferInsert;

export type ProductMedia = typeof productMedia.$inferSelect;
export type NewProductMedia = typeof productMedia.$inferInsert;

