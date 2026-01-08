import { relations } from "drizzle-orm";
import {
    pgTable,
    text,
    timestamp,
    uuid,
    integer,
    index,
    unique,
} from "drizzle-orm/pg-core";

import { tenants, users } from "./core-schema";
import { customers } from "./customer-schema";
import { products, productVariants } from "./product-schema";
import {
    orderStatus,
    paymentStatus,
    fulfillmentStatus,
    orderAddressType,
} from "../enums/order-enums";


export const orders = pgTable(
    "orders",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        tenantId: uuid("tenant_id")
            .notNull()
            .references(() => tenants.id, { onDelete: "cascade" }),

        orderNumber: text("order_number").notNull(),

        customerId: uuid("customer_id").references(() => customers.id, { onDelete: "set null" }),
        userId: text("user_id").references(() => users.id, { onDelete: "set null" }),

        email: text("email"),
        phone: text("phone"),

        currency: text("currency").notNull().default("KES"),

        subtotalAmount: integer("subtotal_amount").notNull().default(0),
        discountAmount: integer("discount_amount").notNull().default(0),
        shippingAmount: integer("shipping_amount").notNull().default(0),
        taxAmount: integer("tax_amount").notNull().default(0),
        totalAmount: integer("total_amount").notNull().default(0),

        status: orderStatus("status").notNull().default("draft"),
        paymentStatus: paymentStatus("payment_status").notNull().default("unpaid"),
        fulfillmentStatus: fulfillmentStatus("fulfillment_status").notNull().default("unfulfilled"),

        placedAt: timestamp("placed_at"),
        cancelledAt: timestamp("cancelled_at"),
        completedAt: timestamp("completed_at"),

        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        unique("orders_tenant_order_number_unique").on(table.tenantId, table.orderNumber),
        index("orders_tenant_idx").on(table.tenantId),
        index("orders_status_idx").on(table.status),
        index("orders_payment_status_idx").on(table.paymentStatus),
        index("orders_fulfillment_status_idx").on(table.fulfillmentStatus),
        index("orders_created_at_idx").on(table.createdAt),
    ],
);

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

        productId: uuid("product_id").references(() => products.id, { onDelete: "set null" }),
        variantId: uuid("variant_id").references(() => productVariants.id, { onDelete: "set null" }),

        title: text("title").notNull(),
        sku: text("sku"),

        quantity: integer("quantity").notNull(),
        unitPriceAmount: integer("unit_price_amount").notNull(),
        currency: text("currency").notNull().default("KES"),

        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => [
        index("order_items_order_idx").on(table.orderId),
        index("order_items_variant_idx").on(table.variantId),
        index("order_items_tenant_idx").on(table.tenantId),
    ],
);

export const orderAddresses = pgTable(
    "order_addresses",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        tenantId: uuid("tenant_id")
            .notNull()
            .references(() => tenants.id, { onDelete: "cascade" }),
        orderId: uuid("order_id")
            .notNull()
            .references(() => orders.id, { onDelete: "cascade" }),
        type: orderAddressType("type").notNull(),

        name: text("name"),
        phone: text("phone"),
        countryCode: text("country_code").notNull().default("KE"),
        city: text("city"),
        region: text("region"),
        postalCode: text("postal_code"),
        addressLine1: text("address_line_1"),
        addressLine2: text("address_line_2"),

        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => [
        index("order_addresses_order_idx").on(table.orderId),
        index("order_addresses_tenant_idx").on(table.tenantId),
        unique("order_addresses_order_type_unique").on(table.orderId, table.type),
    ],
);

export const orderStatusEvents = pgTable(
    "order_status_events",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        tenantId: uuid("tenant_id")
            .notNull()
            .references(() => tenants.id, { onDelete: "cascade" }),
        orderId: uuid("order_id")
            .notNull()
            .references(() => orders.id, { onDelete: "cascade" }),
        eventType: text("event_type").notNull(),
        note: text("note"),
        createdByUserId: text("created_by_user_id").references(() => users.id, { onDelete: "set null" }),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => [
        index("order_status_events_order_idx").on(table.orderId),
        index("order_status_events_tenant_idx").on(table.tenantId),
        index("order_status_events_created_at_idx").on(table.createdAt),
    ],
);

// Relations
export const ordersRelations = relations(orders, ({ one, many }) => ({
    tenant: one(tenants, {
        fields: [orders.tenantId],
        references: [tenants.id],
    }),
    customer: one(customers, {
        fields: [orders.customerId],
        references: [customers.id],
    }),
    user: one(users, {
        fields: [orders.userId],
        references: [users.id],
    }),
    items: many(orderItems),
    addresses: many(orderAddresses),
    statusEvents: many(orderStatusEvents),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
    order: one(orders, {
        fields: [orderItems.orderId],
        references: [orders.id],
    }),
    product: one(products, {
        fields: [orderItems.productId],
        references: [products.id],
    }),
    variant: one(productVariants, {
        fields: [orderItems.variantId],
        references: [productVariants.id],
    }),
}));

export const orderAddressesRelations = relations(orderAddresses, ({ one }) => ({
    order: one(orders, {
        fields: [orderAddresses.orderId],
        references: [orders.id],
    }),
}));

export const orderStatusEventsRelations = relations(orderStatusEvents, ({ one }) => ({
    order: one(orders, {
        fields: [orderStatusEvents.orderId],
        references: [orders.id],
    }),
    createdBy: one(users, {
        fields: [orderStatusEvents.createdByUserId],
        references: [users.id],
    }),
}));

// Types
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type OrderAddress = typeof orderAddresses.$inferSelect;
