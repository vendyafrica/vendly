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
} from "drizzle-orm/pg-core";

export const storeStatus = pgEnum("store_status", ["active", "suspended", "draft"]);
export const productStatus = pgEnum("product_status", ["active", "archived", "draft"]);

export const stores = pgTable(
  "stores",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    tenantId: uuid("tenant_id").notNull(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    logoUrl: text("logo_url"),
    status: storeStatus("status").notNull().default("draft"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    unique("stores_slug_unique").on(table.slug),
    index("stores_tenant_idx").on(table.tenantId),
  ],
);

export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    storeId: uuid("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    priceAmount: integer("price_amount").notNull(),
    currency: text("currency").notNull().default("USD"),
    inventoryQuantity: integer("inventory_quantity").notNull().default(0),
    status: productStatus("status").notNull().default("draft"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("products_store_idx").on(table.storeId)],
);

export const productImages = pgTable(
  "product_images",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
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

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    storeId: uuid("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    imageUrl: text("image_url"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    unique("categories_store_slug_unique").on(table.storeId, table.slug),
    index("categories_store_idx").on(table.storeId),
  ],
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

// Store Theme - colors, typography settings
export const storeThemes = pgTable(
  "store_themes",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    storeId: uuid("store_id")
      .notNull()
      .unique()
      .references(() => stores.id, { onDelete: "cascade" }),

    // Colors
    primaryColor: text("primary_color").default("#1a1a2e"),
    secondaryColor: text("secondary_color").default("#4a6fa5"),
    accentColor: text("accent_color").default("#ffffff"),
    backgroundColor: text("background_color").default("#ffffff"),
    textColor: text("text_color").default("#1a1a2e"),

    // Typography
    headingFont: text("heading_font").default("Inter"),
    bodyFont: text("body_font").default("Inter"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("store_themes_store_idx").on(table.storeId),
  ],
);

// Store Content - editable text and images
export const storeContent = pgTable(
  "store_content",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    storeId: uuid("store_id")
      .notNull()
      .unique()
      .references(() => stores.id, { onDelete: "cascade" }),

    // Hero Section
    heroLabel: text("hero_label").default("Urban Style"),
    heroTitle: text("hero_title"),
    heroSubtitle: text("hero_subtitle"),
    heroCta: text("hero_cta").default("Discover Now"),
    heroImageUrl: text("hero_image_url"),

    // Featured Sections (JSON array)
    featuredSections: jsonb("featured_sections").$type<FeaturedSectionConfig[]>(),

    // Footer
    footerDescription: text("footer_description"),
    newsletterTitle: text("newsletter_title").default("Subscribe to our newsletter"),
    newsletterSubtitle: text("newsletter_subtitle").default("Get the latest updates on new products and upcoming sales"),

    // Puck page data (JSON)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pageData: jsonb("page_data").$type<any>(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("store_content_store_idx").on(table.storeId),
  ],
);

// Featured section configuration type
export interface FeaturedSectionConfig {
  id: number;
  label: string;
  title: string;
  cta: string;
  bgColor: string;
  textColor: string;
  size: "tall" | "normal" | "wide";
  imageUrl?: string;
  href?: string;
}

// Relations
export const storesRelations = relations(stores, ({ many, one }) => ({
  products: many(products),
  categories: many(categories),
  theme: one(storeThemes),
  content: one(storeContent),
  instagramMedia: many(instagramMedia),
}));

export const storeThemesRelations = relations(storeThemes, ({ one }) => ({
  store: one(stores, {
    fields: [storeThemes.storeId],
    references: [stores.id],
  }),
}));

export const storeContentRelations = relations(storeContent, ({ one }) => ({
  store: one(stores, {
    fields: [storeContent.storeId],
    references: [stores.id],
  }),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  store: one(stores, {
    fields: [products.storeId],
    references: [stores.id],
  }),
  images: many(productImages),
  productCategories: many(productCategories),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  store: one(stores, {
    fields: [categories.storeId],
    references: [stores.id],
  }),
  productCategories: many(productCategories),
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

// Types
export type Store = typeof stores.$inferSelect;
export type Product = typeof products.$inferSelect;
export type ProductImage = typeof productImages.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type StoreTheme = typeof storeThemes.$inferSelect;
export type StoreContent = typeof storeContent.$inferSelect;

export const instagramMedia = pgTable(
  "instagram_media",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    storeId: uuid("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    productId: uuid("product_id").references(() => products.id, { onDelete: "set null" }),
    instagramId: text("instagram_id").notNull().unique(),
    mediaType: text("media_type").notNull(), // IMAGE, VIDEO, CAROUSEL_ALBUM
    mediaUrl: text("media_url").notNull(),
    thumbnailUrl: text("thumbnail_url"),
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
    index("instagram_media_store_idx").on(table.storeId),
    index("instagram_media_instagram_id_idx").on(table.instagramId),
    index("instagram_media_product_idx").on(table.productId),
  ],
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
}));

export type InstagramMedia = typeof instagramMedia.$inferSelect;
