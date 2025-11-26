import {
  pgTable,
  uuid,
  varchar,
  text,
  numeric,
  integer,
  boolean,
  timestamp,
  jsonb,
  index,
  unique,
} from 'drizzle-orm/pg-core';
import { productStatusEnum, mediaTypeEnum } from './enums';
import { stores } from './store';

export const products = pgTable(
  'products',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    storeId: uuid('store_id')
      .notNull()
      .references(() => stores.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    description: text('description'),
    shortDescription: varchar('short_description', { length: 500 }),
    category: varchar('category', { length: 100 }),
    subcategory: varchar('subcategory', { length: 100 }),
    price: numeric('price', { precision: 10, scale: 2 }).notNull(),
    compareAtPrice: numeric('compare_at_price', { precision: 10, scale: 2 }),
    status: productStatusEnum('status').default('draft'),
    stock: integer('stock').default(0),
    sku: varchar('sku', { length: 100 }),
    tags: jsonb('tags'), // ['fashion', 'dress', 'summer']
    seoTitle: varchar('seo_title', { length: 255 }),
    seoDescription: varchar('seo_description', { length: 500 }),
    aiGenerated: boolean('ai_generated').default(false),
    sourceInstagramPostId: varchar('source_instagram_post_id', { length: 255 }),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    storeIdx: index('products_store_id_idx').on(table.storeId),
    statusIdx: index('products_status_idx').on(table.status),
    slugUniquePerStore: unique('products_store_slug_unique').on(
      table.storeId,
      table.slug
    ),
  })
);

// PRODUCT VARIANTS
export const productVariants = pgTable(
  'product_variants',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }), // 'Size', 'Color', etc
    value: varchar('value', { length: 255 }), // 'Large', 'Red', etc
    priceModifier: numeric('price_modifier', { precision: 10, scale: 2 }).default('0'),
    stock: integer('stock').default(0),
    sku: varchar('sku', { length: 100 }),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    productIdx: index('product_variants_product_id_idx').on(table.productId),
  })
);

// MEDIA ASSETS
export const mediaAssets = pgTable(
  'media_assets',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    storeId: uuid('store_id').references(() => stores.id, { onDelete: 'cascade' }),
    productId: uuid('product_id').references(() => products.id, { onDelete: 'cascade' }),
    type: mediaTypeEnum('type').notNull(),
    originalUrl: varchar('original_url', { length: 512 }).notNull(),
    optimizedUrl: varchar('optimized_url', { length: 512 }),
    thumbnailUrl: varchar('thumbnail_url', { length: 512 }),
    s3Key: varchar('s3_key', { length: 512 }),
    width: integer('width'),
    height: integer('height'),
    fileSize: integer('file_size'),
    mimeType: varchar('mime_type', { length: 100 }),
    altText: varchar('alt_text', { length: 255 }),
    displayOrder: integer('display_order').default(0),
    sourceInstagramUrl: varchar('source_instagram_url', { length: 512 }),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    storeIdx: index('media_assets_store_id_idx').on(table.storeId),
    productIdx: index('media_assets_product_id_idx').on(table.productId),
  })
);