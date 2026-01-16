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


export const mediaObjects = pgTable(
    "media_objects",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        tenantId: uuid("tenant_id")
            .notNull()
            .references(() => tenants.id, { onDelete: "cascade" }),

        blobUrl: text("blob_url").notNull(),
        blobPathname: text("blob_pathname").notNull(),
        contentType: text("content_type").notNull(),

        source: text("source").notNull().default("upload"),
        sourceMediaId: text("source_media_id"),
        sourceMetadata: jsonb("source_metadata"), // Instagram permalink, caption, etc.
        isPublic: boolean("is_public").default(true).notNull(),

        lastSyncedAt: timestamp("last_synced_at"), // For Instagram media sync tracking
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
    },
    (table) => [
        index("media_objects_tenant_idx").on(table.tenantId),
        index("media_objects_blob_pathname_idx").on(table.blobPathname),
        index("media_objects_source_idx").on(table.source),
    ]
);

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

        title: text("title").notNull(),
        description: text("description"),

        priceAmount: integer("price_amount").notNull().default(0),
        currency: text("currency").notNull().default("KES"),

        source: text("source").notNull().default("manual"),
        sourceId: text("source_id"),
        sourceUrl: text("source_url"),

        isFeatured: boolean("is_featured").default(false),
        hasVariants: boolean("has_variants").default(false),

        viewCount: integer("view_count").default(0).notNull(),

        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
        deletedAt: timestamp("deleted_at"),
    },
    (table) => [
        index("products_tenant_store_idx").on(table.tenantId, table.storeId),
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

        sku: text("sku"),
        title: text("title"),
        priceAmount: integer("price_amount").notNull(),
        currency: text("currency").default("KES"),

        options: jsonb("options"),

        isActive: boolean("is_active").default(true),
        sortOrder: integer("sort_order").default(0),

        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        unique("product_variants_tenant_sku_unique").on(table.tenantId, table.sku),
        index("product_variants_product_idx").on(table.productId),
        index("product_variants_sku_idx").on(table.sku),
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

// Relations
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


// Type exports
export type MediaObject = typeof mediaObjects.$inferSelect;
export type NewMediaObject = typeof mediaObjects.$inferInsert;

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type ProductVariant = typeof productVariants.$inferSelect;
export type NewProductVariant = typeof productVariants.$inferInsert;

export type ProductMedia = typeof productMedia.$inferSelect;
export type NewProductMedia = typeof productMedia.$inferInsert;

