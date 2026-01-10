import { relations } from "drizzle-orm";
import {
    pgTable,
    text,
    timestamp,
    uuid,
    integer,
    index,
} from "drizzle-orm/pg-core";

import { tenants } from "./auth-schema";
import { customers } from "./customer-schema";
import { productVariants } from "./product-schema";
import { cartStatus } from "../enums/cart-enums";

export const carts = pgTable(
    "carts",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        tenantId: uuid("tenant_id")
            .notNull()
            .references(() => tenants.id, { onDelete: "cascade" }),
        customerId: uuid("customer_id").references(() => customers.id, { onDelete: "set null" }),
        currency: text("currency").notNull().default("KES"),
        status: cartStatus("status").notNull().default("active"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        index("carts_tenant_idx").on(table.tenantId),
        index("carts_customer_idx").on(table.customerId),
        index("carts_status_idx").on(table.status),
    ],
);

export const cartItems = pgTable(
    "cart_items",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        tenantId: uuid("tenant_id")
            .notNull()
            .references(() => tenants.id, { onDelete: "cascade" }),
        cartId: uuid("cart_id")
            .notNull()
            .references(() => carts.id, { onDelete: "cascade" }),
        variantId: uuid("variant_id")
            .notNull()
            .references(() => productVariants.id, { onDelete: "restrict" }),
        quantity: integer("quantity").notNull().default(1),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        index("cart_items_cart_idx").on(table.cartId),
        index("cart_items_variant_idx").on(table.variantId),
        index("cart_items_tenant_idx").on(table.tenantId),
    ],
);

// Relations
export const cartsRelations = relations(carts, ({ one, many }) => ({
    tenant: one(tenants, {
        fields: [carts.tenantId],
        references: [tenants.id],
    }),
    customer: one(customers, {
        fields: [carts.customerId],
        references: [customers.id],
    }),
    items: many(cartItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
    cart: one(carts, {
        fields: [cartItems.cartId],
        references: [carts.id],
    }),
    variant: one(productVariants, {
        fields: [cartItems.variantId],
        references: [productVariants.id],
    }),
}));

// Types
export type Cart = typeof carts.$inferSelect;
export type CartItem = typeof cartItems.$inferSelect;
