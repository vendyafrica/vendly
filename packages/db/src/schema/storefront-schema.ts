import { relations } from "drizzle-orm";
import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  index,
  unique,
  jsonb,
} from "drizzle-orm/pg-core";
import { tenants, users } from "./core-schema";
import { categories } from "./category-schema";
import { products, instagramMedia } from "./product-schema";

export const storeStatus = pgEnum("store_status", ["active", "suspended", "draft"]);
export const storeRole = pgEnum("store_role", ["store_owner", "manager", "seller", "viewer"]);

export const stores = pgTable(
  "stores",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    logoUrl: text("logo_url"), 
    coverUrl: text("cover_url"), 

    status: storeStatus("status").notNull().default("draft"),
    defaultCurrency: text("default_currency").default("KES").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [
    unique("stores_tenant_slug_unique").on(table.tenantId, table.slug),
    index("stores_tenant_idx").on(table.tenantId),
    index("stores_slug_idx").on(table.slug),
    index("stores_status_idx").on(table.status),
  ]
);

export const storeMemberships = pgTable(
  "store_memberships",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    storeId: uuid("store_id")
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: storeRole("role").notNull().default("viewer"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    unique("store_memberships_unique").on(table.storeId, table.userId),
    index("store_memberships_store_idx").on(table.storeId),
    index("store_memberships_user_idx").on(table.userId),
  ]
);

// Store Theme - colors, typography settings
export const storeThemes = pgTable(
  "store_themes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    storeId: uuid("store_id")
      .notNull()
      .unique()
      .references(() => stores.id, { onDelete: "cascade" }),

    presetName: text("preset_name"),
    customCssVars: jsonb("custom_css_vars"),

    primaryColor: text("primary_color").default("#1a1a2e"),
    secondaryColor: text("secondary_color").default("#4a6fa5"),
    accentColor: text("accent_color").default("#ffffff"),
    backgroundColor: text("background_color").default("#ffffff"),
    textColor: text("text_color").default("#1a1a2e"),
    headingFont: text("heading_font").default("Inter"),
    bodyFont: text("body_font").default("Inter"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("store_themes_tenant_idx").on(table.tenantId),
    index("store_themes_store_idx").on(table.storeId),
  ]
);

export const storeContent = pgTable(
  "store_content",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    storeId: uuid("store_id")
      .notNull()
      .unique()
      .references(() => stores.id, { onDelete: "cascade" }),

    // Configs
    pageData: jsonb("page_data"), // Puck editor data
    heroConfig: jsonb("hero_config"),
    footerConfig: jsonb("footer_config"),

    // Legacy/Simple fields
    heroLabel: text("hero_label").default("Urban Style"),
    heroTitle: text("hero_title"),
    heroSubtitle: text("hero_subtitle"),
    heroCta: text("hero_cta").default("Discover Now"),
    heroImageUrl: text("hero_image_url"),
    featuredSections: jsonb("featured_sections"),
    footerDescription: text("footer_description"),
    newsletterTitle: text("newsletter_title").default("Subscribe to our newsletter"),
    newsletterSubtitle: text("newsletter_subtitle").default("Get the latest updates on new products and upcoming sales"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("store_content_tenant_idx").on(table.tenantId),
    index("store_content_store_idx").on(table.storeId),
  ]
);

export interface FeaturedSectionConfig {
  id: string;
  type: string;
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

// Relations
export const storesRelations = relations(stores, ({ many, one }) => ({
  tenant: one(tenants, {
    fields: [stores.tenantId],
    references: [tenants.id],
  }),
  memberships: many(storeMemberships),
  categories: many(categories),
  products: many(products),
  theme: one(storeThemes),
  content: one(storeContent),
  instagramMedia: many(instagramMedia),
}));

export const storeMembershipsRelations = relations(storeMemberships, ({ one }) => ({
  store: one(stores, {
    fields: [storeMemberships.storeId],
    references: [stores.id],
  }),
  user: one(users, {
    fields: [storeMemberships.userId],
    references: [users.id],
  }),
}));

export const storeThemesRelations = relations(storeThemes, ({ one }) => ({
  store: one(stores, {
    fields: [storeThemes.storeId],
    references: [stores.id],
  }),
  tenant: one(tenants, {
    fields: [storeThemes.tenantId],
    references: [tenants.id]
  })
}));

export const storeContentRelations = relations(storeContent, ({ one }) => ({
  store: one(stores, {
    fields: [storeContent.storeId],
    references: [stores.id],
  }),
  tenant: one(tenants, {
    fields: [storeContent.tenantId],
    references: [tenants.id]
  })
}));

// Types
export type Store = typeof stores.$inferSelect;
export type NewStore = typeof stores.$inferInsert;
export type StoreMembership = typeof storeMemberships.$inferSelect;
export type StoreTheme = typeof storeThemes.$inferSelect;
export type StoreContent = typeof storeContent.$inferSelect;
