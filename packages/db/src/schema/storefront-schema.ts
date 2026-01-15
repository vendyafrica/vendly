import { relations } from "drizzle-orm";
import {
    pgTable,
    text,
    timestamp,
    uuid,
    index,
    unique,
    boolean,
} from "drizzle-orm/pg-core";

import { tenants } from "./tenant-schema";
import { users } from "./auth-schema";
import { storeRole, storeStatus } from "../enums/storefront-enum";

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

        // Basic Info
        name: text("name").notNull(),
        slug: text("slug").notNull(),
        description: text("description"),

        // Sanity Integration
        sanityStoreId: text("sanity_store_id").notNull(),  // Maps to storeId in Sanity (same as slug)
        sanityDesignSystem: text("sanity_design_system").default('design-system-modern'),  // Reference to Sanity design system

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
        index("stores_sanity_idx").on(table.sanityStoreId),
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

export type Store = typeof stores.$inferSelect;
export type NewStore = typeof stores.$inferInsert;

export type StoreMembership = typeof storeMemberships.$inferSelect;
export type NewStoreMembership = typeof storeMemberships.$inferInsert;
