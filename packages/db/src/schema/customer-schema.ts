import { pgTable, uuid, text, timestamp, integer, numeric, index, unique } from "drizzle-orm/pg-core";
import { tenants } from "./tenant-schema";
import { stores } from "./storefront-schema";
import { users } from "./auth-schema";


export const platformCustomers = pgTable(
    "platform_customers",
    {
        userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
        lifetimeOrders: integer("lifetime_orders").default(0),
        lifetimeSpend: numeric("lifetime_spend", { precision: 12, scale: 2 }).default("0"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [index("platform_customers_userId_idx").on(table.userId)],
)

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