import { relations } from "drizzle-orm";
import {
    pgTable,
    text,
    timestamp,
    uuid,
    boolean,
    index,
    unique,
    integer,
    numeric,
} from "drizzle-orm/pg-core";

import { users } from "./auth-schema";
import { tenants } from "./tenant-schema";
import { stores } from "./storefront-schema";
import { platformAdminRole } from "../enums/tenant-enums";

/**
 * Platform Admins
 * Users with elevated permissions to manage the entire platform
 */
export const platformAdmins = pgTable(
    "platform_admins",
    {
        userId: text("user_id")
            .primaryKey()
            .references(() => users.id, { onDelete: "cascade" }),
        role: platformAdminRole("role").notNull().default("platform_support"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [index("platform_admins_role_idx").on(table.role)]
);

/**
 * Store Customers
 * Tracks customer relationships with specific stores.
 * A user becomes a customer when they make a purchase from a store.
 * Same user can be a customer of multiple stores.
 */
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
        userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
        
        // Customer contact info (can differ from user account)
        email: text("email"),
        phone: text("phone"),
        name: text("name"),
        
        // Analytics fields
        firstPurchaseAt: timestamp("first_purchase_at"),
        lastPurchaseAt: timestamp("last_purchase_at"),
        totalOrders: integer("total_orders").default(0).notNull(),
        totalSpent: numeric("total_spent", { precision: 10, scale: 2 }).default("0").notNull(),
        averageOrderValue: numeric("average_order_value", { precision: 10, scale: 2 }).default("0").notNull(),
        
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        unique("store_customers_store_user_unique").on(table.storeId, table.userId),
        unique("store_customers_store_email_unique").on(table.storeId, table.email),
        index("store_customers_tenant_idx").on(table.tenantId),
        index("store_customers_store_idx").on(table.storeId),
        index("store_customers_user_idx").on(table.userId),
        index("store_customers_email_idx").on(table.email),
        index("store_customers_phone_idx").on(table.phone),
    ]
);

/**
 * Customer Addresses
 * Shipping and billing addresses for store customers
 */
export const customerAddresses = pgTable(
    "customer_addresses",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        tenantId: uuid("tenant_id")
            .notNull()
            .references(() => tenants.id, { onDelete: "cascade" }),
        storeId: uuid("store_id")
            .notNull()
            .references(() => stores.id, { onDelete: "cascade" }),
        customerId: uuid("customer_id")
            .notNull()
            .references(() => storeCustomers.id, { onDelete: "cascade" }),
        
        name: text("name"),
        phone: text("phone"),
        
        // Address details
        countryCode: text("country_code").notNull().default("KE"),
        city: text("city"),
        region: text("region"),
        addressLine1: text("address_line_1"),
        addressLine2: text("address_line_2"),
        postalCode: text("postal_code"),
        
        // Address flags
        isDefaultShipping: boolean("is_default_shipping").default(false).notNull(),
        isDefaultBilling: boolean("is_default_billing").default(false).notNull(),
        
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        index("customer_addresses_customer_idx").on(table.customerId),
        index("customer_addresses_store_idx").on(table.storeId),
        index("customer_addresses_tenant_idx").on(table.tenantId),
    ]
);

/**
 * Customer Analytics Events
 * Track customer behavior and interactions for analytics
 */
export const customerAnalytics = pgTable(
    "customer_analytics",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        tenantId: uuid("tenant_id")
            .notNull()
            .references(() => tenants.id, { onDelete: "cascade" }),
        storeId: uuid("store_id")
            .notNull()
            .references(() => stores.id, { onDelete: "cascade" }),
        customerId: uuid("customer_id")
            .notNull()
            .references(() => storeCustomers.id, { onDelete: "cascade" }),
        
        eventType: text("event_type").notNull(), 
        eventData: text("event_data"), 
        
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => [
        index("customer_analytics_customer_idx").on(table.customerId),
        index("customer_analytics_store_idx").on(table.storeId),
        index("customer_analytics_event_type_idx").on(table.eventType),
        index("customer_analytics_created_at_idx").on(table.createdAt),
    ]
);

// Relations
export const platformAdminsRelations = relations(platformAdmins, ({ one }) => ({
    user: one(users, {
        fields: [platformAdmins.userId],
        references: [users.id],
    }),
}));

export const storeCustomersRelations = relations(storeCustomers, ({ one, many }) => ({
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
    addresses: many(customerAddresses),
    analytics: many(customerAnalytics),
}));

export const customerAddressesRelations = relations(customerAddresses, ({ one }) => ({
    tenant: one(tenants, {
        fields: [customerAddresses.tenantId],
        references: [tenants.id],
    }),
    store: one(stores, {
        fields: [customerAddresses.storeId],
        references: [stores.id],
    }),
    customer: one(storeCustomers, {
        fields: [customerAddresses.customerId],
        references: [storeCustomers.id],
    }),
}));

export const customerAnalyticsRelations = relations(customerAnalytics, ({ one }) => ({
    tenant: one(tenants, {
        fields: [customerAnalytics.tenantId],
        references: [tenants.id],
    }),
    store: one(stores, {
        fields: [customerAnalytics.storeId],
        references: [stores.id],
    }),
    customer: one(storeCustomers, {
        fields: [customerAnalytics.customerId],
        references: [storeCustomers.id],
    }),
}));

// Types
export type PlatformAdmin = typeof platformAdmins.$inferSelect;
export type NewPlatformAdmin = typeof platformAdmins.$inferInsert;

export type StoreCustomer = typeof storeCustomers.$inferSelect;
export type NewStoreCustomer = typeof storeCustomers.$inferInsert;

export type CustomerAddress = typeof customerAddresses.$inferSelect;
export type NewCustomerAddress = typeof customerAddresses.$inferInsert;

export type CustomerAnalytic = typeof customerAnalytics.$inferSelect;
export type NewCustomerAnalytic = typeof customerAnalytics.$inferInsert;