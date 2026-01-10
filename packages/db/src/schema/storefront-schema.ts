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
    boolean,
    integer,
} from "drizzle-orm/pg-core";

import { tenants } from "./tenant-schema";
import { users } from "./auth-schema";
import { storeCategories } from "./category-schema";
import { products, instagramMedia } from "./product-schema";

export const storeStatus = pgEnum("store_status", ["active", "suspended", "draft"]);
export const storeRole = pgEnum("store_role", ["store_owner", "manager", "seller", "viewer"]);
export const themePreset = pgEnum("theme_preset", [
    "minimal",
    "bold",
    "elegant",
    "modern",
    "vintage",
    "playful",
]);

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
        
        // Theme selection
        preset: themePreset("preset").notNull().default("minimal"),
        
        // Color system
        colors: jsonb("colors").$type<{
            primary?: string;
            secondary?: string;
            accent?: string;
            background?: string;
            foreground?: string;
            muted?: string;
            mutedForeground?: string;
            border?: string;
            input?: string;
            ring?: string;
            // Additional theme-specific colors
            [key: string]: string | undefined;
        }>(),
        
        // Typography
        typography: jsonb("typography").$type<{
            fontFamily?: string;
            headingFont?: string;
            bodyFont?: string;
            fontSize?: {
                base?: string;
                scale?: number;
            };
            fontWeights?: {
                normal?: number;
                medium?: number;
                semibold?: number;
                bold?: number;
            };
        }>(),
        
        // Layout preferences
        layout: jsonb("layout").$type<{
            containerWidth?: "narrow" | "normal" | "wide" | "full";
            borderRadius?: "none" | "small" | "medium" | "large";
            spacing?: "compact" | "normal" | "relaxed";
            headerStyle?: "minimal" | "centered" | "sticky";
            footerStyle?: "minimal" | "detailed";
        }>(),
        
        // Component styles
        components: jsonb("components").$type<{
            buttonStyle?: "solid" | "outline" | "ghost";
            cardStyle?: "elevated" | "bordered" | "flat";
            inputStyle?: "default" | "filled" | "underlined";
            // Add more component customizations
        }>(),
        
        // Custom CSS variables (advanced users)
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
        index("store_themes_preset_idx").on(table.preset),
    ]
);

/**
 * Store Content
 * Page content and layout configuration
 */
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
        
        // Puck/Plasmic editor data
        editorData: jsonb("editor_data").$type<any>(), // Raw editor JSON
        
        // Hero section
        hero: jsonb("hero").$type<{
            enabled?: boolean;
            layout?: "centered" | "split" | "fullscreen";
            label?: string;
            title?: string;
            subtitle?: string;
            ctaText?: string;
            ctaLink?: string;
            secondaryCtaText?: string;
            secondaryCtaLink?: string;
            imageUrl?: string;
            videoUrl?: string;
            backgroundOverlay?: boolean;
        }>(),
        
        // Featured sections (products, categories, etc.)
        sections: jsonb("sections").$type<Array<{
            id: string;
            type: "products" | "categories" | "instagram" | "banner" | "testimonials" | "custom";
            title?: string;
            subtitle?: string;
            enabled?: boolean;
            settings?: {
                layout?: "grid" | "list" | "carousel" | "masonry";
                columns?: 2 | 3 | 4 | 6;
                showPrices?: boolean;
                showDescriptions?: boolean;
                autoplay?: boolean;
                autoplayDelay?: number;
                maxItems?: number;
                sortBy?: string;
                filter?: any;
            };
            items?: any[]; // Products, categories, or custom content
            content?: any; // For custom HTML or rich text
        }>>(),
        
        // Footer configuration
        footer: jsonb("footer").$type<{
            description?: string;
            showSocialLinks?: boolean;
            showNewsletter?: boolean;
            newsletterTitle?: string;
            newsletterSubtitle?: string;
            columns?: Array<{
                title: string;
                links: Array<{
                    label: string;
                    url: string;
                }>;
            }>;
            copyright?: string;
        }>(),
        
        // Announcement bar
        announcement: jsonb("announcement").$type<{
            enabled?: boolean;
            text?: string;
            link?: string;
            backgroundColor?: string;
            textColor?: string;
        }>(),
        
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
        
        title: text("title").notNull(),
        slug: text("slug").notNull(),
        
        // Page content
        content: text("content"), // Rich text/HTML
        editorData: jsonb("editor_data").$type<any>(), // Puck/Plasmic data
        
        // SEO
        metaTitle: text("meta_title"),
        metaDescription: text("meta_description"),
        
        // Settings
        isPublished: boolean("is_published").default(true),
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
        index("store_pages_published_idx").on(table.isPublished),
        index("store_pages_menu_order_idx").on(table.menuOrder), // Optional: add index for sorting
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
            id: string;
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
export const storesRelations = relations(stores, ({ one, many }) => ({
    tenant: one(tenants, {
        fields: [stores.tenantId],
        references: [tenants.id],
    }),
    memberships: many(storeMemberships),
    categories: many(storeCategories),
    products: many(products),
    theme: one(storeThemes),
    content: one(storeContent),
    pages: many(storePages),
    navigation: many(storeNavigation),
    instagramMedia: many(instagramMedia),
}));

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
}));

export const storeContentRelations = relations(storeContent, ({ one }) => ({
    tenant: one(tenants, {
        fields: [storeContent.tenantId],
        references: [tenants.id],
    }),
    store: one(stores, {
        fields: [storeContent.storeId],
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

// Type exports
export type Store = typeof stores.$inferSelect;
export type NewStore = typeof stores.$inferInsert;

export type StoreMembership = typeof storeMemberships.$inferSelect;
export type NewStoreMembership = typeof storeMemberships.$inferInsert;

export type StoreTheme = typeof storeThemes.$inferSelect;
export type NewStoreTheme = typeof storeThemes.$inferInsert;

export type StoreContent = typeof storeContent.$inferSelect;
export type NewStoreContent = typeof storeContent.$inferInsert;

export type StorePage = typeof storePages.$inferSelect;
export type NewStorePage = typeof storePages.$inferInsert;

export type StoreNavigation = typeof storeNavigation.$inferSelect;
export type NewStoreNavigation = typeof storeNavigation.$inferInsert;