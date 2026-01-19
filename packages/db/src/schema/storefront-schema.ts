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
    integer,
    numeric,
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

export const storeCustomers = pgTable(
    "store_customers",
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


        totalOrders: integer("total_orders").default(0),
        totalSpend: numeric("total_spend", { precision: 12, scale: 2 }).default("0"),
        lastOrderAt: timestamp("last_order_at"),

        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        unique("store_customers_unique").on(table.storeId, table.userId),
        index("store_customers_tenant_idx").on(table.tenantId),
        index("store_customers_store_idx").on(table.storeId),
        index("store_customers_user_idx").on(table.userId),
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
