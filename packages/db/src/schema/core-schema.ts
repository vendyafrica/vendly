import { relations } from "drizzle-orm";
import {
    pgTable,
    text,
    timestamp,
    uuid,
    boolean,
    uniqueIndex,
    index,
    jsonb,
    unique,
    integer,
} from "drizzle-orm/pg-core";

import { tenantRole, tenantStatus } from "../enums/tenant-enums";
export { tenantRole, tenantStatus };

/**
 * Users table
 * Managed by auth provider but core to the system.
 * Not tenant-scoped (users can belong to multiple tenants).
 */
export const users = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});

/**
 * Auth Sessions
 */
export const session = pgTable(
    "session",
    {
        id: text("id").primaryKey(),
        expiresAt: timestamp("expires_at").notNull(),
        token: text("token").notNull().unique(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => new Date())
            .notNull(),
        ipAddress: text("ip_address"),
        userAgent: text("user_agent"),
        userId: text("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
    },
    (table) => [index("session_userId_idx").on(table.userId)],
);

/**
 * Auth Accounts
 */
export const account = pgTable(
    "account",
    {
        id: text("id").primaryKey(),
        accountId: text("account_id").notNull(),
        providerId: text("provider_id").notNull(),
        userId: text("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        accessToken: text("access_token"),
        refreshToken: text("refresh_token"),
        idToken: text("id_token"),
        accessTokenExpiresAt: timestamp("access_token_expires_at"),
        refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
        scope: text("scope"),
        password: text("password"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [index("account_userId_idx").on(table.userId)],
);

/**
 * Auth Verification Tokens
 */
export const verification = pgTable(
    "verification",
    {
        id: text("id").primaryKey(),
        identifier: text("identifier").notNull(),
        value: text("value").notNull(),
        expiresAt: timestamp("expires_at").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [index("verification_identifier_idx").on(table.identifier)],
);

/**
 * Tenants table
 * The root of multi-tenancy.
 */
export const tenants = pgTable(
    "tenants",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        name: text("name").notNull(),
        slug: text("slug").notNull(),
        status: tenantStatus("status").notNull().default("onboarding"),
        plan: text("plan").default("free"),
        billingEmail: text("billing_email"),
        settings: jsonb("settings"),

        storefrontConfig: jsonb("storefront_config"),
        demoUrl: text("demo_url"),
        v0ChatId: text("v0_chat_id"),
        generatedFiles: jsonb("generated_files"),
        plasmicTemplate: text("plasmic_template"), 
        vercelDeploymentUrl: text("vercel_deployment_url"),
        error: text("error"),

        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
        deletedAt: timestamp("deleted_at"),
    },
    (table) => [
        uniqueIndex("tenants_slug_idx").on(table.slug),
        index("tenants_status_idx").on(table.status),
    ]
);

/**
 * Tenant Memberships
 * Links users to tenants with roles.
 */
export const tenantMemberships = pgTable(
    "tenant_memberships",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        tenantId: uuid("tenant_id")
            .notNull()
            .references(() => tenants.id, { onDelete: "cascade" }),
        userId: text("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        role: tenantRole("role").notNull().default("owner"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        unique("tenant_memberships_unique").on(table.tenantId, table.userId),
        index("tenant_memberships_tenant_idx").on(table.tenantId),
        index("tenant_memberships_user_idx").on(table.userId),
    ]
);

/**
 * Platform Categories
 * Global categories that tenants inherit from.
 */
export const platformCategories = pgTable(
    "platform_categories",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        name: text("name").notNull(), // Fashion, Shoes, etc.
        slug: text("slug").notNull().unique(),
        imageUrl: text("image_url"), // Vercel Blob URL
        sortOrder: integer("sort_order"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    }
);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
    tenantMemberships: many(tenantMemberships),
    sessions: many(session),
    accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
    user: one(users, {
        fields: [session.userId],
        references: [users.id],
    }),
}));

export const accountRelations = relations(account, ({ one }) => ({
    user: one(users, {
        fields: [account.userId],
        references: [users.id],
    }),
}));

export const tenantsRelations = relations(tenants, ({ many }) => ({
    memberships: many(tenantMemberships),
}));

export const tenantMembershipsRelations = relations(tenantMemberships, ({ one }) => ({
    tenant: one(tenants, {
        fields: [tenantMemberships.tenantId],
        references: [tenants.id],
    }),
    user: one(users, {
        fields: [tenantMemberships.userId],
        references: [users.id],
    }),
}));

// Typed exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof session.$inferSelect;
export type Account = typeof account.$inferSelect;
export type Tenant = typeof tenants.$inferSelect;
export type NewTenant = typeof tenants.$inferInsert;
export type TenantMembership = typeof tenantMemberships.$inferSelect;
export type PlatformCategory = typeof platformCategories.$inferSelect;
