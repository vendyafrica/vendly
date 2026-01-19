import { relations } from "drizzle-orm";
import {
    pgTable,
    text,
    timestamp,
    uuid,
    index,
    unique,
    boolean,
    jsonb,
} from "drizzle-orm/pg-core";

import { tenants } from "./tenant-schema";
import { users } from "./auth-schema";


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

        customDomain: text("custom_domain").unique(),
        domainVerified: boolean("domain_verified").default(false),
        domainVerifiedAt: timestamp("domain_verified_at"),
        status: boolean("status").notNull().default(false),
        defaultCurrency: text("default_currency").default("KES").notNull(),

        email: text("email"),
        phone: text("phone"),
        address: text("address"),

        theme: jsonb("theme").default({}),
        content: jsonb("content").default({}),

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
    ]
);

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

        role: text("role").notNull(),

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
