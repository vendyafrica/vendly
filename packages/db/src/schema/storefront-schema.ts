import { relations } from "drizzle-orm";
import {
    pgTable,
    text,
    timestamp,
    uuid,
    index,
    unique,
    jsonb,
    boolean,
    integer,
} from "drizzle-orm/pg-core";

import { tenants } from "./tenant-schema";
import { users } from "./auth-schema";
import { storeRole, storeStatus } from "../enums/storefront-enum";

/**
 * Templates
 * Pre-defined store templates that users can choose from.
 * Contains default configuration for themes, content, navigation, and pages.
 */
export const templates = pgTable(
    "templates",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        name: text("name").notNull(),
        slug: text("slug").notNull().unique(), // e.g., 'old-money', 'minimalist'
        description: text("description"),
        thumbnailUrl: text("thumbnail_url"),

        // Preview colors for the UI selection
        previewColors: jsonb("preview_colors").$type<string[]>(),

        // Default CSS Variables for this template
        defaultCssVariables: jsonb("default_css_variables").$type<Record<string, string>>().notNull(),

        // Default Puck data for each system page
        defaultPages: jsonb("default_pages").$type<{
            home: { content: any[]; root: { props: any }; zones: any };
            product: { content: any[]; root: { props: any }; zones: any };
            category: { content: any[]; root: { props: any }; zones: any };
            checkout: { content: any[]; root: { props: any }; zones: any };
        }>().notNull(),

        isActive: boolean("is_active").default(true).notNull(),

        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        index("templates_slug_idx").on(table.slug),
        index("templates_active_idx").on(table.isActive),
    ]
);

/**
 * Stores
 * Individual storefronts owned by tenants
 */
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

        // Branding
        logoUrl: text("logo_url"),
        coverUrl: text("cover_url"),
        faviconUrl: text("favicon_url"),

        // Domain Settings
        customDomain: text("custom_domain").unique(),  // e.g., "shop.merchant.com"
        domainVerified: boolean("domain_verified").default(false),
        domainVerifiedAt: timestamp("domain_verified_at"),

        // Settings
        status: storeStatus("status").notNull().default("draft"),
        defaultCurrency: text("default_currency").default("KES").notNull(),

        // SEO
        metaTitle: text("meta_title"),
        metaDescription: text("meta_description"),

        // Social
        facebookUrl: text("facebook_url"),
        instagramUrl: text("instagram_url"),
        twitterUrl: text("twitter_url"),
        whatsappNumber: text("whatsapp_number"),

        // Contact
        email: text("email"),
        phone: text("phone"),
        address: text("address"),

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

/**
 * Store Memberships
 * Team members with access to manage stores
 */
export const storeMemberships = pgTable(
    "store_memberships",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        tenantId: uuid("tenant_id")
            .notNull()
            .references(() => tenants.id, { onDelete: "cascade" }),
        storeId: uuid("store_id")
            .notNull()
            .references(() => stores.id, { onDelete: "cascade" }),
        userId: text("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),

        role: storeRole("role").notNull(),

        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        unique("store_memberships_unique").on(table.storeId, table.userId),
        index("store_memberships_tenant_idx").on(table.tenantId),
        index("store_memberships_store_idx").on(table.storeId),
        index("store_memberships_user_idx").on(table.userId),
    ]
);

/**
 * Store Themes
 * Visual theming configuration for each store
 */
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

        // Reference to the template used
        templateId: uuid("template_id").references(() => templates.id),

        // CSS Variables (consumed by all Puck components)
        cssVariables: jsonb("css_variables").$type<{
            // Colors
            "--color-background": string;
            "--color-foreground": string;
            "--color-primary": string;
            "--color-primary-foreground": string;
            "--color-secondary": string;
            "--color-muted": string;
            "--color-accent": string;
            "--color-border": string;

            // Typography
            "--font-heading": string;
            "--font-body": string;
            "--font-size-base": string;

            // Spacing & Layout
            "--radius": string;
            "--container-width": string;

            // Additional custom variables
            [key: `--${string}`]: string;
        }>().notNull(),

        // Custom CSS (advanced users)
        customCss: text("custom_css"),

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

/**
 * Store Settings
 * Global store settings that apply across all pages
 */
export const storeSettings = pgTable(
    "store_settings",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        storeId: uuid("store_id").notNull().unique().references(() => stores.id, { onDelete: "cascade" }),
        tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),

        // Global Header Config (rendered on all pages)
        headerConfig: jsonb("header_config").$type<{
            logoUrl?: string;
            showSearch: boolean;
            showCart: boolean;
            stickyHeader: boolean;
            announcement?: { enabled: boolean; text: string; link?: string };
        }>().notNull().default({
            showSearch: true,
            showCart: true,
            stickyHeader: true,
        }),

        // Global Footer Config
        footerConfig: jsonb("footer_config").$type<{
            columns: Array<{ title: string; links: Array<{ label: string; url: string }> }>;
            showNewsletter: boolean;
            copyright: string;
            socialLinks?: { facebook?: string; instagram?: string; twitter?: string };
        }>().notNull().default({
            columns: [],
            showNewsletter: false,
            copyright: "© {year} {storeName}",
        }),

        // Checkout Config
        checkoutConfig: jsonb("checkout_config").$type<{
            allowGuestCheckout: boolean;
            collectPhone: boolean;
            collectShippingAddress: boolean;
        }>().notNull().default({
            allowGuestCheckout: true,
            collectPhone: true,
            collectShippingAddress: true,
        }),

        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
    },
    (table) => [
        index("store_settings_store_idx").on(table.storeId),
        index("store_settings_tenant_idx").on(table.tenantId),
    ]
);

/**
 * Store Pages
 * Additional pages (About, Contact, Terms, etc.)
 */
export const storePages = pgTable(
    "store_pages",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        tenantId: uuid("tenant_id")
            .notNull()
            .references(() => tenants.id, { onDelete: "cascade" }),
        storeId: uuid("store_id")
            .notNull()
            .references(() => stores.id, { onDelete: "cascade" }),

        // Page identity
        slug: text("slug").notNull(),  // e.g., "home", "about", "product"
        type: text("page_type").notNull().default("custom"),  // "home" | "product" | "category" | "checkout" | "custom"
        title: text("title").notNull(),

        // Puck Editor Data (the core visual content)
        puckData: jsonb("puck_data").$type<{
            content: Array<{
                type: string;
                props: { id: string;[key: string]: any };
                readOnly?: Record<string, boolean>;
            }>;
            root: { props: Record<string, any> };
            zones: Record<string, Array<{
                type: string;
                props: { id: string;[key: string]: any };
            }>>;
        }>().notNull().default({ content: [], root: { props: {} }, zones: {} }),

        // Published version (frozen copy for live site)
        publishedPuckData: jsonb("published_puck_data").$type<{
            content: Array<{ type: string; props: Record<string, any> }>;
            root: { props: Record<string, any> };
            zones: Record<string, Array<{ type: string; props: Record<string, any> }>>;
        }>(),
        publishedAt: timestamp("published_at"),

        // SEO
        metaTitle: text("meta_title"),
        metaDescription: text("meta_description"),
        ogImage: text("og_image"),

        // Status
        isPublished: boolean("is_published").default(false).notNull(),
        isSystem: boolean("is_system").default(false).notNull(),  // true = cannot delete (home, product, checkout)

        // Menu settings
        showInMenu: boolean("show_in_menu").default(false),
        menuOrder: integer("menu_order").default(0),

        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        unique("store_pages_store_slug_unique").on(table.storeId, table.slug),
        index("store_pages_tenant_idx").on(table.tenantId),
        index("store_pages_store_idx").on(table.storeId),
        index("store_pages_type_idx").on(table.type),
        index("store_pages_published_idx").on(table.isPublished),
    ]
);

/**
 * Store Navigation
 * Custom navigation menus
 */
export const storeNavigation = pgTable(
    "store_navigation",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        tenantId: uuid("tenant_id")
            .notNull()
            .references(() => tenants.id, { onDelete: "cascade" }),
        storeId: uuid("store_id")
            .notNull()
            .references(() => stores.id, { onDelete: "cascade" }),

        name: text("name").notNull(), // "Main Menu", "Footer Menu"
        position: text("position").notNull(), // "header", "footer", "sidebar"

        items: jsonb("items").$type<Array<{
            id?: string;
            label: string;
            url?: string;
            type?: "link" | "category" | "page" | "product";
            targetId?: string; // ID of category, page, or product
            openInNewTab?: boolean;
            children?: Array<any>; // For nested menus
        }>>(),

        isActive: boolean("is_active").default(true),

        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        index("store_navigation_tenant_idx").on(table.tenantId),
        index("store_navigation_store_idx").on(table.storeId),
        index("store_navigation_position_idx").on(table.position),
    ]
);

// Relations
export const storeMembershipsRelations = relations(storeMemberships, ({ one }) => ({
    tenant: one(tenants, {
        fields: [storeMemberships.tenantId],
        references: [tenants.id],
    }),
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
    tenant: one(tenants, {
        fields: [storeThemes.tenantId],
        references: [tenants.id],
    }),
    store: one(stores, {
        fields: [storeThemes.storeId],
        references: [stores.id],
    }),
    template: one(templates, {
        fields: [storeThemes.templateId],
        references: [templates.id],
    }),
}));

export const storeSettingsRelations = relations(storeSettings, ({ one }) => ({
    tenant: one(tenants, {
        fields: [storeSettings.tenantId],
        references: [tenants.id],
    }),
    store: one(stores, {
        fields: [storeSettings.storeId],
        references: [stores.id],
    }),
}));

export const storePagesRelations = relations(storePages, ({ one }) => ({
    tenant: one(tenants, {
        fields: [storePages.tenantId],
        references: [tenants.id],
    }),
    store: one(stores, {
        fields: [storePages.storeId],
        references: [stores.id],
    }),
}));

export const storeNavigationRelations = relations(storeNavigation, ({ one }) => ({
    tenant: one(tenants, {
        fields: [storeNavigation.tenantId],
        references: [tenants.id],
    }),
    store: one(stores, {
        fields: [storeNavigation.storeId],
        references: [stores.id],
    }),
}));

export type Template = typeof templates.$inferSelect;
export type NewTemplate = typeof templates.$inferInsert;

export type Store = typeof stores.$inferSelect;
export type NewStore = typeof stores.$inferInsert;

export type StoreMembership = typeof storeMemberships.$inferSelect;
export type NewStoreMembership = typeof storeMemberships.$inferInsert;

export type StoreTheme = typeof storeThemes.$inferSelect;
export type NewStoreTheme = typeof storeThemes.$inferInsert;

export type StoreSettings = typeof storeSettings.$inferSelect;
export type NewStoreSettings = typeof storeSettings.$inferInsert;

export type StorePage = typeof storePages.$inferSelect;
export type NewStorePage = typeof storePages.$inferInsert;

export type StoreNavigation = typeof storeNavigation.$inferSelect;
export type NewStoreNavigation = typeof storeNavigation.$inferInsert;