import { relations } from "drizzle-orm";
import {
    pgTable,
    text,
    timestamp,
    uuid,
    uniqueIndex,
    index,
    unique,
} from "drizzle-orm/pg-core";

// Import users table to reference it
import { users } from "./auth-schema";

import { tenantRole, tenantStatus } from "../enums/tenant-enums";
export { tenantRole, tenantStatus };

/**
 * Tenants table
 * The root of multi-tenancy.
 */
export const tenants = pgTable(
    "tenants",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        name: text("name").notNull(),
        slug: text("slug").notNull().unique(),
        status: tenantStatus("status").notNull().default("onboarding"),
        plan: text("plan").default("free"),
        billingEmail: text("billing_email"),
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

// Relations
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
export type Tenant = typeof tenants.$inferSelect;
export type NewTenant = typeof tenants.$inferInsert;
export type TenantMembership = typeof tenantMemberships.$inferSelect;