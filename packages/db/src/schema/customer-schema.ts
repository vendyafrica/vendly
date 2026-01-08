import { relations } from "drizzle-orm";
import {
    pgTable,
    text,
    timestamp,
    uuid,
    boolean,
    index,
    unique,
} from "drizzle-orm/pg-core";

import { tenants, users } from "./core-schema";
import { platformAdminRole } from "../enums/tenant-enums";

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
    (table) => [index("platform_admins_role_idx").on(table.role)],
);

export const customers = pgTable(
    "customers",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        tenantId: uuid("tenant_id")
            .notNull()
            .references(() => tenants.id, { onDelete: "cascade" }),
        userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
        email: text("email"),
        phone: text("phone"),
        name: text("name"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        index("customers_tenant_idx").on(table.tenantId),
        index("customers_tenant_email_idx").on(table.tenantId, table.email),
        index("customers_tenant_phone_idx").on(table.tenantId, table.phone),
        unique("customers_tenant_user_unique").on(table.tenantId, table.userId),
    ],
);

export const customerAddresses = pgTable(
    "customer_addresses",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        tenantId: uuid("tenant_id")
            .notNull()
            .references(() => tenants.id, { onDelete: "cascade" }),
        customerId: uuid("customer_id")
            .notNull()
            .references(() => customers.id, { onDelete: "cascade" }),
        name: text("name"),
        phone: text("phone"),
        countryCode: text("country_code").notNull().default("KE"),
        city: text("city"),
        region: text("region"),
        addressLine1: text("address_line_1"),
        addressLine2: text("address_line_2"),
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
        index("customer_addresses_tenant_idx").on(table.tenantId),
    ],
);

// Relations
export const platformAdminsRelations = relations(platformAdmins, ({ one }) => ({
    user: one(users, {
        fields: [platformAdmins.userId],
        references: [users.id],
    }),
}));

export const customersRelations = relations(customers, ({ one, many }) => ({
    tenant: one(tenants, {
        fields: [customers.tenantId],
        references: [tenants.id],
    }),
    user: one(users, {
        fields: [customers.userId],
        references: [users.id],
    }),
    addresses: many(customerAddresses),
}));

export const customerAddressesRelations = relations(customerAddresses, ({ one }) => ({
    customer: one(customers, {
        fields: [customerAddresses.customerId],
        references: [customers.id],
    }),
}));

// Types
export type PlatformAdmin = typeof platformAdmins.$inferSelect;
export type Customer = typeof customers.$inferSelect;
export type CustomerAddress = typeof customerAddresses.$inferSelect;
