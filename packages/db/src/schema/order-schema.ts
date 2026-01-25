import { relations } from "drizzle-orm";
import {
    pgTable,
    text,
    jsonb,
    timestamp,
    uuid,
    integer,
    index,
    unique,
} from "drizzle-orm/pg-core";

import { tenants } from "./tenant-schema";
import { stores } from "./storefront-schema";
import { products } from "./product-schema";

/**
 * Orders table - represents customer orders
 */
export const orders = pgTable(
    "orders",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        tenantId: uuid("tenant_id")
            .notNull()
            .references(() => tenants.id, { onDelete: "cascade" }),
        storeId: uuid("store_id")
            .notNull()
            .references(() => stores.id, { onDelete: "cascade" }),

        // Order identification
        orderNumber: text("order_number").notNull(),

        // Customer info (snapshot at order time)
        customerName: text("customer_name").notNull(),
        customerEmail: text("customer_email").notNull(),
        customerPhone: text("customer_phone"),

        // Order status
        status: text("status").notNull().default("pending"), // pending, processing, completed, cancelled, refunded
        paymentMethod: text("payment_method").notNull().default("cash_on_delivery"), // card, mpesa, paypal, cash_on_delivery
        paymentStatus: text("payment_status").notNull().default("pending"), // pending, paid, failed, refunded

        // Pricing (stored in smallest currency unit, e.g., cents)
        subtotal: integer("subtotal").notNull().default(0),
        shippingCost: integer("shipping_cost").notNull().default(0),
        totalAmount: integer("total_amount").notNull().default(0),
        currency: text("currency").notNull().default("KES"),

        // Shipping address
        shippingAddress: jsonb("shipping_address").$type<{
            street?: string;
            city?: string;
            state?: string;
            postalCode?: string;
            country?: string;
        }>(),

        // Additional info
        notes: text("notes"),

        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
        deletedAt: timestamp("deleted_at"),
    },
    (table) => [
        index("orders_tenant_store_idx").on(table.tenantId, table.storeId),
        index("orders_status_idx").on(table.status),
        index("orders_payment_status_idx").on(table.paymentStatus),
        index("orders_created_at_idx").on(table.createdAt),
        unique("orders_store_number_unique").on(table.storeId, table.orderNumber),
    ]
);

/**
 * Order Items table - individual items within an order
 */
export const orderItems = pgTable(
    "order_items",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        tenantId: uuid("tenant_id")
            .notNull()
            .references(() => tenants.id, { onDelete: "cascade" }),
        orderId: uuid("order_id")
            .notNull()
            .references(() => orders.id, { onDelete: "cascade" }),
        productId: uuid("product_id")
            .references(() => products.id, { onDelete: "set null" }),

        // Product snapshot at order time
        productName: text("product_name").notNull(),
        productImage: text("product_image"),

        // Quantity and pricing
        quantity: integer("quantity").notNull().default(1),
        unitPrice: integer("unit_price").notNull(),
        totalPrice: integer("total_price").notNull(),
        currency: text("currency").notNull().default("KES"),

        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => [
        index("order_items_order_idx").on(table.orderId),
        index("order_items_product_idx").on(table.productId),
    ]
);

// Relations
export const ordersRelations = relations(orders, ({ one, many }) => ({
    tenant: one(tenants, {
        fields: [orders.tenantId],
        references: [tenants.id],
    }),
    store: one(stores, {
        fields: [orders.storeId],
        references: [stores.id],
    }),
    items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
    tenant: one(tenants, {
        fields: [orderItems.tenantId],
        references: [tenants.id],
    }),
    order: one(orders, {
        fields: [orderItems.orderId],
        references: [orders.id],
    }),
    product: one(products, {
        fields: [orderItems.productId],
        references: [products.id],
    }),
}));

// Types
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;

export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;

export type OrderStatus = "pending" | "processing" | "completed" | "cancelled" | "refunded";
export type PaymentMethod = "card" | "mpesa" | "paypal" | "cash_on_delivery";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
