import { relations } from "drizzle-orm";
import {
    pgEnum,
    pgTable,
    text,
    timestamp,
    uuid,
    integer,
    boolean,
    index,
    unique,
    primaryKey,
    jsonb,
    bigint,
} from "drizzle-orm/pg-core";
import { tenants } from "./core-schema";
import { stores } from "./storefront-schema";
import { categories } from "./category-schema";

export const productStatus = pgEnum("product_status", ["active", "archived", "draft"]);

export const mediaObjects = pgTable(
    "media_objects",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        tenantId: uuid("tenant_id")
            .notNull()
            .references(() => tenants.id, { onDelete: "cascade" }),
        blobUrl: text("blob_url").notNull(),
        blobPathname: text("blob_pathname"),
        contentType: text("content_type"),
        sizeBytes: bigint("size_bytes", { mode: "number" }),
        width: integer("width"),
        height: integer("height"),
        altText: text("alt_text"),
        isPublic: boolean("is_public").default(true),
        source: text("source"),

        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
    },
    (table) => [
        index("media_objects_tenant_idx").on(table.tenantId),
        index("media_objects_blob_pathname_idx").on(table.blobPathname),
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
        status: productStatus("status").notNull().default("draft"),

        basePriceAmount: integer("base_price_amount").notNull().default(0),
        baseCurrency: text("base_currency").notNull().default("KES"),
        compareAtPrice: integer("compare_at_price"),

        hasVariants: boolean("has_variants").default(false),

        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
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
        tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
        productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
        sku: text("sku"),
        title: text("title"), // "Red / XL"
        priceAmount: integer("price_amount").notNull(),
        currency: text("currency").default("KES"),
        compareAtPrice: integer("compare_at_price"),
        options: jsonb("options"), // { color: "Red", size: "XL" }
        isActive: boolean("is_active").default(true),
        sortOrder: integer("sort_order").default(0),

        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
    },
    (table) => [
        unique("product_variants_tenant_sku_unique").on(table.tenantId, table.sku),
        index("product_variants_product_idx").on(table.productId),
    ]
);

export const inventoryItems = pgTable(
    "inventory_items",
    {
        variantId: uuid("variant_id").primaryKey().references(() => productVariants.id, { onDelete: "cascade" }),
        tenantId: uuid("tenant_id").notNull(), // Denormalized for speed
        quantityOnHand: integer("quantity_on_hand").notNull().default(0),
        quantityReserved: integer("quantity_reserved").default(0),
        trackInventory: boolean("track_inventory").default(true),
        updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
    },
    (table) => [
        index("inventory_items_tenant_idx").on(table.tenantId),
    ]
);

export const productMedia = pgTable(
    "product_media",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
        productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
        mediaId: uuid("media_id").notNull().references(() => mediaObjects.id, { onDelete: "cascade" }),
        variantId: uuid("variant_id").references(() => productVariants.id, { onDelete: "set null" }), // Linked to specific variant

        sortOrder: integer("sort_order").default(0),
        isFeatured: boolean("is_featured").default(false), // Hero image

        createdAt: timestamp("created_at").defaultNow(),
    },
    (table) => [
        index("product_media_product_idx").on(table.productId),
        index("product_media_media_idx").on(table.mediaId),
    ]
);

export const productCategories = pgTable(
    "product_categories",
    {
        productId: uuid("product_id")
            .notNull()
            .references(() => products.id, { onDelete: "cascade" }),
        categoryId: uuid("category_id")
            .notNull()
            .references(() => categories.id, { onDelete: "cascade" }),
    },
    (table) => [
        primaryKey({ columns: [table.productId, table.categoryId] }),
        index("product_categories_product_idx").on(table.productId),
        index("product_categories_category_idx").on(table.categoryId),
    ],
);

export const instagramMedia = pgTable(
    "instagram_media",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
        storeId: uuid("store_id")
            .notNull()
            .references(() => stores.id, { onDelete: "cascade" }),
        productId: uuid("product_id").references(() => products.id, { onDelete: "set null" }),
        instagramId: text("instagram_id").notNull(),
        mediaType: text("media_type").notNull(), // IMAGE, VIDEO, CAROUSEL_ALBUM
        mediaUrl: text("media_url").notNull(),
        thumbnailUrl: text("thumbnail_url"),
        mediaObjectId: uuid("media_object_id").references(() => mediaObjects.id, { onDelete: "set null" }),
        thumbnailMediaObjectId: uuid("thumbnail_media_object_id").references(() => mediaObjects.id, { onDelete: "set null" }),
        permalink: text("permalink"),
        caption: text("caption"),
        timestamp: timestamp("timestamp"),
        isImported: boolean("is_imported").default(false).notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        unique("instagram_media_tenant_instagram_id_unique").on(table.tenantId, table.instagramId),
        index("instagram_media_store_idx").on(table.storeId),
        index("instagram_media_instagram_id_idx").on(table.instagramId),
        index("instagram_media_product_idx").on(table.productId),
    ],
);

// Backward compatibility for simple product images
export const productImages = pgTable(
    "product_images",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        productId: uuid("product_id")
            .notNull()
            .references(() => products.id, { onDelete: "cascade" }),
        url: text("url").notNull(),
        sortOrder: integer("sort_order").notNull().default(0),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => [
        index("product_images_product_idx").on(table.productId),
        index("product_images_sort_idx").on(table.productId, table.sortOrder),
    ],
);

export const productImagesRelations = relations(productImages, ({ one }) => ({
    product: one(products, {
        fields: [productImages.productId],
        references: [products.id],
    }),
}));

// Relations
export const productsRelations = relations(products, ({ one, many }) => ({
    store: one(stores, {
        fields: [products.storeId],
        references: [stores.id],
    }),
    tenant: one(tenants, {
        fields: [products.tenantId],
        references: [tenants.id]
    }),
    variants: many(productVariants),
    media: many(productMedia),
    images: many(productImages), // added
    productCategories: many(productCategories),
}));

export const productVariantsRelations = relations(productVariants, ({ one }) => ({
    product: one(products, {
        fields: [productVariants.productId],
        references: [products.id]
    }),
    inventory: one(inventoryItems, {
        fields: [productVariants.id],
        references: [inventoryItems.variantId]
    })
}));

export const inventoryItemsRelations = relations(inventoryItems, ({ one }) => ({
    variant: one(productVariants, {
        fields: [inventoryItems.variantId],
        references: [productVariants.id]
    })
}));

export const productMediaRelations = relations(productMedia, ({ one }) => ({
    product: one(products, {
        fields: [productMedia.productId],
        references: [products.id]
    }),
    media: one(mediaObjects, {
        fields: [productMedia.mediaId],
        references: [mediaObjects.id]
    })
}));

export const productCategoriesRelations = relations(
    productCategories,
    ({ one }) => ({
        product: one(products, {
            fields: [productCategories.productId],
            references: [products.id],
        }),
        category: one(categories, {
            fields: [productCategories.categoryId],
            references: [categories.id],
        }),
    }),
);

export const instagramMediaRelations = relations(instagramMedia, ({ one }) => ({
    store: one(stores, {
        fields: [instagramMedia.storeId],
        references: [stores.id],
    }),
    product: one(products, {
        fields: [instagramMedia.productId],
        references: [products.id],
    }),
    mediaObject: one(mediaObjects, {
        fields: [instagramMedia.mediaObjectId],
        references: [mediaObjects.id],
    }),
    thumbnailMediaObject: one(mediaObjects, {
        fields: [instagramMedia.thumbnailMediaObjectId],
        references: [mediaObjects.id],
    }),
}));

export type Product = typeof products.$inferSelect;
export type ProductVariant = typeof productVariants.$inferSelect;
export type InventoryItem = typeof inventoryItems.$inferSelect;
export type MediaObject = typeof mediaObjects.$inferSelect;
export type ProductImage = typeof productImages.$inferSelect;
