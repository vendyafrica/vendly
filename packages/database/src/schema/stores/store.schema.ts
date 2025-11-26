import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  numeric,
  jsonb,
  index,
  unique,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import {
  storeStatusEnum,
  paymentMethodEnum,
  deliveryMethodEnum,
} from '../shared/shared.schema.enums';
import { sellers } from '../sellers/seller.schema';
import { products } from '../products/product.schema';
import { mediaAssets } from '../products/product.schema';
import { aiRequests } from '../ai/ai.schema';


export const stores = pgTable(
  'stores',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    sellerId: uuid('seller_id')
      .notNull()
      .references(() => sellers.id, { onDelete: 'cascade' }),
    storeName: varchar('store_name', { length: 255 }).notNull(),
    subdomain: varchar('subdomain', { length: 255 }).unique().notNull(),
    tagline: varchar('tagline', { length: 500 }),
    description: text('description'),
    logo: varchar('logo', { length: 512 }),
    bannerImage: varchar('banner_image', { length: 512 }),
    status: storeStatusEnum('status').default('draft'),
    v0ProjectId: varchar('v0_project_id', { length: 255 }),
    v0ChatId: varchar('v0_chat_id', { length: 255 }),
    v0DeploymentUrl: varchar('v0_deployment_url', { length: 512 }),
    v0VersionId: varchar('v0_version_id', { length: 255 }),
    storeUrl: varchar('store_url', { length: 512 }),
    customDomain: varchar('custom_domain', { length: 255 }),
    isPublished: boolean('is_published').default(false),
    publishedAt: timestamp('published_at'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    sellerIdx: index('stores_seller_id_idx').on(table.sellerId),
    subdomainIdx: index('stores_subdomain_idx').on(table.subdomain),
    statusIdx: index('stores_status_idx').on(table.status),
  })
);

// BRAND PALETTES & AESTHETICS
export const brandPalettes = pgTable(
  'brand_palettes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    storeId: uuid('store_id')
      .notNull()
      .references(() => stores.id, { onDelete: 'cascade' }),
    primaryColor: varchar('primary_color', { length: 7 }).notNull(), // hex
    secondaryColor: varchar('secondary_color', { length: 7 }).notNull(),
    accentColor: varchar('accent_color', { length: 7 }),
    textColor: varchar('text_color', { length: 7 }).default('#000000'),
    backgroundColor: varchar('background_color', { length: 7 }).default('#FFFFFF'),
    aesthetic: varchar('aesthetic', { length: 50 }), // 'minimalist', 'vibrant', 'luxury', etc
    fontFamily: varchar('font_family', { length: 100 }),
    theme: varchar('theme', { length: 255 }), // template/theme identifier
    customizations: jsonb('customizations'), // store additional theme data
    aiGenerated: boolean('ai_generated').default(true),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    storeIdx: index('brand_palettes_store_id_idx').on(table.storeId),
  })
);


export const themes = pgTable(
  'themes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).unique().notNull(),
    description: text('description'),
    aesthetic: varchar('aesthetic', { length: 50 }),
    layout: varchar('layout', { length: 50 }), // 'grid', 'list', 'masonry'
    previewImage: varchar('preview_image', { length: 512 }),
    v0TemplatePrompt: text('v0_template_prompt'), // Base prompt for this theme
    customizationSchema: jsonb('customization_schema'), // What can be customized
    isDefault: boolean('is_default').default(false),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    slugIdx: index('themes_slug_idx').on(table.slug),
  })
);

export const sellerPaymentMethods = pgTable(
  'seller_payment_methods',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    sellerId: uuid('seller_id')
      .notNull()
      .references(() => sellers.id, { onDelete: 'cascade' }),
    method: paymentMethodEnum('method').notNull(),
    isEnabled: boolean('is_enabled').default(true),
    credentials: jsonb('credentials'), // encrypted: { tillNumber, paybillNumber, cardDetails }
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    sellerMethodUnique: unique('seller_payment_methods_seller_method_unique').on(
      table.sellerId,
      table.method
    ),
  })
);

// CARTS (Buyer Session)
export const carts = pgTable(
  'carts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    buyerId: uuid('buyer_id'),
    storeId: uuid('store_id')
      .notNull()
      .references(() => stores.id, { onDelete: 'cascade' }),
    sessionId: varchar('session_id', { length: 255 }),
    items: jsonb('items'), // [{ productId, variantId, quantity, price }]
    total: numeric('total', { precision: 12, scale: 2 }).default('0'),
    expiresAt: timestamp('expires_at'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    storeIdx: index('carts_store_id_idx').on(table.storeId),
    buyerIdx: index('carts_buyer_id_idx').on(table.buyerId),
    sessionIdx: index('carts_session_id_idx').on(table.sessionId),
  })
);

// ORDERS
export const orders = pgTable(
  'orders',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orderNumber: varchar('order_number', { length: 50 }).unique().notNull(), // ORD-YYYYMMDD-XXXX
    storeId: uuid('store_id')
      .notNull()
      .references(() => stores.id, { onDelete: 'restrict' }),
    buyerId: uuid('buyer_id').notNull(),
    items: jsonb('items'), // Cart items snapshot
    subtotal: numeric('subtotal', { precision: 12, scale: 2 }).notNull(),
    deliveryFee: numeric('delivery_fee', { precision: 10, scale: 2 }).notNull(),
    total: numeric('total', { precision: 12, scale: 2 }).notNull(),
    paymentMethod: paymentMethodEnum('payment_method').notNull(),
    deliveryMethod: deliveryMethodEnum('delivery_method').notNull(),
    deliveryAddress: jsonb('delivery_address'), // { street, city, lat, lng, notes }
    status: varchar('status', { length: 50 }).default('pending_payment'),
    trackingNumber: varchar('tracking_number', { length: 255 }),
    vendlyOrderId: varchar('vendly_order_id', { length: 255 }),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    storeIdx: index('orders_store_id_idx').on(table.storeId),
    orderNumberIdx: index('orders_order_number_idx').on(table.orderNumber),
    statusIdx: index('orders_status_idx').on(table.status),
  })
);

// DELIVERY METHODS (Seller Config)
export const sellerDeliveryMethods = pgTable(
  'seller_delivery_methods',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    sellerId: uuid('seller_id')
      .notNull()
      .references(() => sellers.id, { onDelete: 'cascade' }),
    method: deliveryMethodEnum('method').notNull(),
    isEnabled: boolean('is_enabled').default(true),
    config: jsonb('config'), // { courierPartner: 'sendy', apiKey: '...', zones: [...] }
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    sellerMethodUnique: unique('seller_delivery_methods_seller_method_unique').on(
      table.sellerId,
      table.method
    ),
  })
);

export const storesRelations = relations(stores, ({ one, many }) => ({
  seller: one(sellers, { fields: [stores.sellerId], references: [sellers.id] }),
  products: many(products),
  media: many(mediaAssets),
  brandPalette: one(brandPalettes),
  aiRequests: many(aiRequests),
  carts: many(carts),
  orders: many(orders),
}));

export const brandPalettesRelations = relations(brandPalettes, ({ one }) => ({
  store: one(stores, { fields: [brandPalettes.storeId], references: [stores.id] }),
}));

export const themesRelations = relations(themes, ({ many }) => ({})); // No direct relations, but can be linked via brandPalettes.theme

export const sellerPaymentMethodsRelations = relations(sellerPaymentMethods, ({ one }) => ({
  seller: one(sellers, { fields: [sellerPaymentMethods.sellerId], references: [sellers.id] }),
}));

export const cartsRelations = relations(carts, ({ one }) => ({
  store: one(stores, { fields: [carts.storeId], references: [stores.id] }),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  store: one(stores, { fields: [orders.storeId], references: [stores.id] }),
}));

export const sellerDeliveryMethodsRelations = relations(sellerDeliveryMethods, ({ one }) => ({
  seller: one(sellers, { fields: [sellerDeliveryMethods.sellerId], references: [sellers.id] }),
}));