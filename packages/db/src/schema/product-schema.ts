import { relations } from "drizzle-orm";
import {
    pgEnum,
    pgTable,
    text,
    jsonb,
    timestamp,
    uuid,
    integer,
    boolean,
    index,
    unique,
    numeric,
} from "drizzle-orm/pg-core";

import { tenants } from "./tenant-schema";
import { stores } from "./storefront-schema";
import { storeCustomers } from "./customer-schema";

export const productStatus = pgEnum("product_status", ["active", "archived", "draft"]);

/**
 * Media Objects
 * Centralized media storage for products, stores, and other entities
 */
export const mediaObjects = pgTable(
    "media_objects",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        tenantId: uuid("tenant_id")
            .notNull()
            .references(() => tenants.id, { onDelete: "cascade" }),

        // Blob Storage Info
        blobUrl: text("blob_url").notNull(),  // https://xxx.public.blob.vercel-storage.com/...
        blobPathname: text("blob_pathname").notNull(),  // Internal path for deletion
        contentType: text("content_type").notNull(),  // image/jpeg, video/mp4
        sizeBytes: integer("size_bytes").notNull(),

        // Image/Video Metadata
        width: integer("width"),
        height: integer("height"),
        duration: integer("duration"),  // For videos (in seconds)
        altText: text("alt_text"),

        // Source Tracking
        source: text("source").notNull().default("upload"),  // "upload" | "instagram" | "tiktok"
        sourceMediaId: text("source_media_id"),  // Original media ID from platform

        isPublic: boolean("is_public").default(true).notNull(),

        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
    },
    (table) => [
        index("media_objects_tenant_idx").on(table.tenantId),
        index("media_objects_blob_pathname_idx").on(table.blobPathname),
        index("media_objects_source_idx").on(table.source),
    ]
);

/**
 * Products
 * Store-specific products with pricing and variants support
 */
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

        // Product Identity
        title: text("title").notNull(),
        slug: text("slug").notNull(),
        description: text("description"),
        shortDescription: text("short_description"),

        // Pricing (stored in cents/smallest currency unit)
        priceAmount: integer("price_amount").notNull().default(0),
        currency: text("currency").notNull().default("KES"),
        compareAtPrice: integer("compare_at_price"),  // Original price for discounts

        // Source Tracking
        source: text("source").notNull().default("manual"),  // "manual" | "instagram" | "tiktok"
        sourceId: text("source_id"),  // External ID from social platform
        sourceUrl: text("source_url"),  // Link to original post

        // Status & Features
        status: productStatus("status").notNull().default("draft"),
        isFeatured: boolean("is_featured").default(false),
        hasVariants: boolean("has_variants").default(false),

        // SEO
        metaTitle: text("meta_title"),
        metaDescription: text("meta_description"),

        // Analytics
        viewCount: integer("view_count").default(0).notNull(),

        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
        deletedAt: timestamp("deleted_at"),
    },
    (table) => [
        unique("products_store_slug_unique").on(table.storeId, table.slug),
        index("products_tenant_store_idx").on(table.tenantId, table.storeId),
        index("products_status_idx").on(table.status),
        index("products_source_idx").on(table.source),
        index("products_source_id_idx").on(table.sourceId),
    ]
);

/**
 * Product Variants
 * Different versions of a product (e.g., size, color combinations)
 */
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
        title: text("title"), // "Red / XL"
        priceAmount: integer("price_amount").notNull(),
        currency: text("currency").default("KES"),
        compareAtPrice: integer("compare_at_price"),

        options: jsonb("options"), // { color: "Red", size: "XL" }

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

/**
 * Inventory Items
 * Stock tracking for product variants
 */
export const inventoryItems = pgTable(
    "inventory_items",
    {
        variantId: uuid("variant_id")
            .primaryKey()
            .references(() => productVariants.id, { onDelete: "cascade" }),
        tenantId: uuid("tenant_id").notNull(),

        quantityOnHand: integer("quantity_on_hand").notNull().default(0),
        quantityReserved: integer("quantity_reserved").default(0),
        quantityAvailable: integer("quantity_available").default(0), // calculated: onHand - reserved

        trackInventory: boolean("track_inventory").default(true),
        allowBackorder: boolean("allow_backorder").default(false),

        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        index("inventory_items_tenant_idx").on(table.tenantId),
    ]
);

/**
 * Product Media
 * Links products to media objects (images, videos)
 */
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

        // Optional link to specific variant
        variantId: uuid("variant_id")
            .references(() => productVariants.id, { onDelete: "set null" }),

        sortOrder: integer("sort_order").default(0).notNull(),
        isFeatured: boolean("is_featured").default(false).notNull(),  // Primary image for cards

        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => [
        index("product_media_product_idx").on(table.productId),
        index("product_media_media_idx").on(table.mediaId),
        index("product_media_sort_idx").on(table.productId, table.sortOrder),
    ]
);

/**
 * Social Media Integrations
 * Track connected accounts and import history
 */
export const socialIntegrations = pgTable(
    "social_integrations",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
        storeId: uuid("store_id").notNull().references(() => stores.id, { onDelete: "cascade" }),

        platform: text("platform").notNull(),  // "instagram" | "tiktok" | "facebook"
        platformUserId: text("platform_user_id").notNull(),
        platformUsername: text("platform_username"),

        // OAuth Tokens (encrypted in app layer usually, storing raw for now as simple text)
        accessToken: text("access_token").notNull(),
        refreshToken: text("refresh_token"),
        tokenExpiresAt: timestamp("token_expires_at"),

        // Import Settings
        autoImportEnabled: boolean("auto_import_enabled").default(false),
        lastImportedAt: timestamp("last_imported_at"),

        isActive: boolean("is_active").default(true).notNull(),

        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
    },
    (table) => [
        unique("social_integrations_platform_user_unique").on(table.platform, table.platformUserId, table.storeId),
        index("social_integrations_store_idx").on(table.storeId),
        index("social_integrations_tenant_idx").on(table.tenantId),
    ]
);

/**
 * Product Reviews
 * Customer reviews and ratings for products
 */
export const productReviews = pgTable(
    "product_reviews",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        tenantId: uuid("tenant_id")
            .notNull()
            .references(() => tenants.id, { onDelete: "cascade" }),
        storeId: uuid("store_id")
            .notNull()
            .references(() => stores.id, { onDelete: "cascade" }),
        productId: uuid("product_id")
            .notNull()
            .references(() => products.id, { onDelete: "cascade" }),
        customerId: uuid("customer_id")
            .notNull()
            .references(() => storeCustomers.id, { onDelete: "cascade" }),

        rating: integer("rating").notNull(), // 1-5
        title: text("title"),
        comment: text("comment"),

        isVerifiedPurchase: boolean("is_verified_purchase").default(false),
        isPublished: boolean("is_published").default(true),

        helpfulCount: integer("helpful_count").default(0),

        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        index("product_reviews_product_idx").on(table.productId),
        index("product_reviews_customer_idx").on(table.customerId),
        index("product_reviews_store_idx").on(table.storeId),
        index("product_reviews_rating_idx").on(table.rating),
    ]
);

/**
 * Product Offers
 * Special deals, discounts, and promotions for products
 */
export const productOffers = pgTable(
    "product_offers",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        tenantId: uuid("tenant_id")
            .notNull()
            .references(() => tenants.id, { onDelete: "cascade" }),
        storeId: uuid("store_id")
            .notNull()
            .references(() => stores.id, { onDelete: "cascade" }),
        productId: uuid("product_id")
            .notNull()
            .references(() => products.id, { onDelete: "cascade" }),

        title: text("title").notNull(),
        description: text("description"),

        discountType: text("discount_type").notNull(), // 'percentage', 'fixed_amount'
        discountValue: numeric("discount_value", { precision: 10, scale: 2 }).notNull(),

        minQuantity: integer("min_quantity").default(1),
        maxQuantity: integer("max_quantity"),

        startDate: timestamp("start_date").notNull(),
        endDate: timestamp("end_date").notNull(),

        isActive: boolean("is_active").default(true),

        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        index("product_offers_product_idx").on(table.productId),
        index("product_offers_store_idx").on(table.storeId),
        index("product_offers_dates_idx").on(table.startDate, table.endDate),
        index("product_offers_active_idx").on(table.isActive),
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
    reviews: many(productReviews),
    offers: many(productOffers),
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
    inventory: one(inventoryItems, {
        fields: [productVariants.id],
        references: [inventoryItems.variantId],
    }),
    media: many(productMedia),
}));

export const inventoryItemsRelations = relations(inventoryItems, ({ one }) => ({
    variant: one(productVariants, {
        fields: [inventoryItems.variantId],
        references: [productVariants.id],
    }),
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

export const socialIntegrationsRelations = relations(socialIntegrations, ({ one }) => ({
    tenant: one(tenants, {
        fields: [socialIntegrations.tenantId],
        references: [tenants.id],
    }),
    store: one(stores, {
        fields: [socialIntegrations.storeId],
        references: [stores.id],
    }),
}));

export const productReviewsRelations = relations(productReviews, ({ one }) => ({
    tenant: one(tenants, {
        fields: [productReviews.tenantId],
        references: [tenants.id],
    }),
    store: one(stores, {
        fields: [productReviews.storeId],
        references: [stores.id],
    }),
    product: one(products, {
        fields: [productReviews.productId],
        references: [products.id],
    }),
    customer: one(storeCustomers, {
        fields: [productReviews.customerId],
        references: [storeCustomers.id],
    }),
}));

export const productOffersRelations = relations(productOffers, ({ one }) => ({
    tenant: one(tenants, {
        fields: [productOffers.tenantId],
        references: [tenants.id],
    }),
    store: one(stores, {
        fields: [productOffers.storeId],
        references: [stores.id],
    }),
    product: one(products, {
        fields: [productOffers.productId],
        references: [products.id],
    }),
}));

// Type exports
export type MediaObject = typeof mediaObjects.$inferSelect;
export type NewMediaObject = typeof mediaObjects.$inferInsert;

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type ProductVariant = typeof productVariants.$inferSelect;
export type NewProductVariant = typeof productVariants.$inferInsert;

export type InventoryItem = typeof inventoryItems.$inferSelect;
export type NewInventoryItem = typeof inventoryItems.$inferInsert;

export type ProductMedia = typeof productMedia.$inferSelect;
export type NewProductMedia = typeof productMedia.$inferInsert;

export type SocialIntegration = typeof socialIntegrations.$inferSelect;
export type NewSocialIntegration = typeof socialIntegrations.$inferInsert;

export type ProductReview = typeof productReviews.$inferSelect;
export type NewProductReview = typeof productReviews.$inferInsert;

export type ProductOffer = typeof productOffers.$inferSelect;
export type NewProductOffer = typeof productOffers.$inferInsert;