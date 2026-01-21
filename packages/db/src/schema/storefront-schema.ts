import { relations } from "drizzle-orm";
import {
    pgTable,
    text,
    timestamp,
    uuid,
    index,
    unique,
    boolean,
    integer,
    numeric,
} from "drizzle-orm/pg-core";

import { tenants } from "./tenant-schema";
import { users } from "./auth-schema";
import { storeCustomers } from "./customer-schema";


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
        categories: text("categories").array().default([]),

        customDomain: text("custom_domain").unique(),
        domainVerified: boolean("domain_verified").default(false),
        domainVerifiedAt: timestamp("domain_verified_at"),
        status: boolean("status").notNull().default(false),
        defaultCurrency: text("default_currency").default("KES").notNull(),

        storeContactPhone: text("store_contact_phone"),
        storeContactEmail: text("store_contact_email"),
        storeAddress: text("store_address"),

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

export const storeCustomersRelations = relations(storeCustomers, ({ one }) => ({
    tenant: one(tenants, {
        fields: [storeCustomers.tenantId],
        references: [tenants.id],
    }),
    store: one(stores, {
        fields: [storeCustomers.storeId],
        references: [stores.id],
    }),
    user: one(users, {
        fields: [storeCustomers.userId],
        references: [users.id],
    }),
}));

export type Store = typeof stores.$inferSelect;
export type NewStore = typeof stores.$inferInsert;

export type StoreCustomer = typeof storeCustomers.$inferSelect;
export type NewStoreCustomer = typeof storeCustomers.$inferInsert;
