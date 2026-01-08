import { relations } from "drizzle-orm";
import {
    pgTable,
    text,
    timestamp,
    uuid,
    integer,
    boolean,
    index,
    primaryKey,
} from "drizzle-orm/pg-core";

import { tenants } from "./core-schema";
import { orders, orderItems } from "./order-schema";
import { shipmentStatus } from "../enums/shipping-enums";

export const shippingMethods = pgTable(
    "shipping_methods",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        tenantId: uuid("tenant_id")
            .notNull()
            .references(() => tenants.id, { onDelete: "cascade" }),
        name: text("name").notNull(),
        carrier: text("carrier"),
        priceAmount: integer("price_amount").notNull().default(0),
        currency: text("currency").notNull().default("KES"),
        isActive: boolean("is_active").notNull().default(true),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        index("shipping_methods_tenant_idx").on(table.tenantId),
        index("shipping_methods_active_idx").on(table.isActive),
    ],
);

export const shipments = pgTable(
    "shipments",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        tenantId: uuid("tenant_id")
            .notNull()
            .references(() => tenants.id, { onDelete: "cascade" }),
        orderId: uuid("order_id")
            .notNull()
            .references(() => orders.id, { onDelete: "cascade" }),
        shippingMethodId: uuid("shipping_method_id").references(() => shippingMethods.id, { onDelete: "set null" }),

        status: shipmentStatus("status").notNull().default("pending"),
        trackingNumber: text("tracking_number"),
        trackingUrl: text("tracking_url"),

        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        index("shipments_order_idx").on(table.orderId),
        index("shipments_tenant_idx").on(table.tenantId),
        index("shipments_status_idx").on(table.status),
    ],
);

export const shipmentItems = pgTable(
    "shipment_items",
    {
        shipmentId: uuid("shipment_id")
            .notNull()
            .references(() => shipments.id, { onDelete: "cascade" }),
        orderItemId: uuid("order_item_id")
            .notNull()
            .references(() => orderItems.id, { onDelete: "cascade" }),
        quantity: integer("quantity").notNull(),
    },
    (table) => [
        primaryKey({ columns: [table.shipmentId, table.orderItemId] }),
        index("shipment_items_shipment_idx").on(table.shipmentId),
        index("shipment_items_order_item_idx").on(table.orderItemId),
    ],
);

export const shipmentEvents = pgTable(
    "shipment_events",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        tenantId: uuid("tenant_id")
            .notNull()
            .references(() => tenants.id, { onDelete: "cascade" }),
        shipmentId: uuid("shipment_id")
            .notNull()
            .references(() => shipments.id, { onDelete: "cascade" }),
        status: shipmentStatus("status").notNull(),
        note: text("note"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => [
        index("shipment_events_shipment_idx").on(table.shipmentId),
        index("shipment_events_tenant_idx").on(table.tenantId),
        index("shipment_events_created_at_idx").on(table.createdAt),
    ],
);

// Relations
export const shipmentsRelations = relations(shipments, ({ one, many }) => ({
    order: one(orders, {
        fields: [shipments.orderId],
        references: [orders.id],
    }),
    method: one(shippingMethods, {
        fields: [shipments.shippingMethodId],
        references: [shippingMethods.id],
    }),
    items: many(shipmentItems),
    events: many(shipmentEvents),
}));

export const shipmentItemsRelations = relations(shipmentItems, ({ one }) => ({
    shipment: one(shipments, {
        fields: [shipmentItems.shipmentId],
        references: [shipments.id],
    }),
    orderItem: one(orderItems, {
        fields: [shipmentItems.orderItemId],
        references: [orderItems.id],
    }),
}));

export const shipmentEventsRelations = relations(shipmentEvents, ({ one }) => ({
    shipment: one(shipments, {
        fields: [shipmentEvents.shipmentId],
        references: [shipments.id],
    }),
}));

// Types
export type ShippingMethod = typeof shippingMethods.$inferSelect;
export type Shipment = typeof shipments.$inferSelect;
