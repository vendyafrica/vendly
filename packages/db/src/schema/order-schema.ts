import { relations } from "drizzle-orm";
import {
    pgTable,
    text,
    timestamp,
    uuid,
    integer,
    index,
    unique,
    numeric,
    jsonb,
} from "drizzle-orm/pg-core";

import { tenants } from "./tenant-schema";
import { users } from "./auth-schema";
import { stores } from "./storefront-schema";
import { storeCustomers } from "./customer-schema";
import { products, productVariants } from "./product-schema";
import {
    orderStatus,
    paymentStatus,
    fulfillmentStatus,
    orderAddressType,
} from "../enums/order-enums";

/**
 * Orders
 * Customer orders placed at specific stores
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
        
        orderNumber: text("order_number").notNull(),
        
        customerId: uuid("customer_id")
            .references(() => storeCustomers.id, { onDelete: "set null" }),
        userId: text("user_id")
            .references(() => users.id, { onDelete: "set null" }),
        
        // Contact info
        email: text("email"),
        phone: text("phone"),
        
        // Financial
        currency: text("currency").notNull().default("KES"),
        subtotalAmount: integer("subtotal_amount").notNull().default(0),
        discountAmount: integer("discount_amount").notNull().default(0),
        shippingAmount: integer("shipping_amount").notNull().default(0),
        taxAmount: integer("tax_amount").notNull().default(0),
        totalAmount: integer("total_amount").notNull().default(0),
        
        // Discount tracking
        discountCode: text("discount_code"),
        discountName: text("discount_name"),
        
        // Status tracking
        status: orderStatus("status").notNull().default("draft"),
        paymentStatus: paymentStatus("payment_status").notNull().default("unpaid"),
        fulfillmentStatus: fulfillmentStatus("fulfillment_status").notNull().default("unfulfilled"),
        
        // Timestamps
        placedAt: timestamp("placed_at"),
        cancelledAt: timestamp("cancelled_at"),
        completedAt: timestamp("completed_at"),
        
        // Notes
        customerNote: text("customer_note"),
        internalNote: text("internal_note"),
        
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        unique("orders_tenant_order_number_unique").on(table.tenantId, table.orderNumber),
        index("orders_tenant_idx").on(table.tenantId),
        index("orders_store_idx").on(table.storeId),
        index("orders_customer_idx").on(table.customerId),
        index("orders_status_idx").on(table.status),
        index("orders_payment_status_idx").on(table.paymentStatus),
        index("orders_fulfillment_status_idx").on(table.fulfillmentStatus),
        index("orders_placed_at_idx").on(table.placedAt),
        index("orders_created_at_idx").on(table.createdAt),
    ]
);

/**
 * Order Items
 * Individual products/variants within an order
 */
export const orderItems = pgTable(
    "order_items",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        tenantId: uuid("tenant_id")
            .notNull()
            .references(() => tenants.id, { onDelete: "cascade" }),
        storeId: uuid("store_id")
            .notNull()
            .references(() => stores.id, { onDelete: "cascade" }),
        orderId: uuid("order_id")
            .notNull()
            .references(() => orders.id, { onDelete: "cascade" }),
        
        productId: uuid("product_id")
            .references(() => products.id, { onDelete: "set null" }),
        variantId: uuid("variant_id")
            .references(() => productVariants.id, { onDelete: "set null" }),
        
        // Product snapshot at time of order
        title: text("title").notNull(),
        variantTitle: text("variant_title"),
        sku: text("sku"),
        
        quantity: integer("quantity").notNull(),
        unitPriceAmount: integer("unit_price_amount").notNull(),
        totalPriceAmount: integer("total_price_amount").notNull(), // quantity * unitPrice
        currency: text("currency").notNull().default("KES"),
        
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => [
        index("order_items_order_idx").on(table.orderId),
        index("order_items_product_idx").on(table.productId),
        index("order_items_variant_idx").on(table.variantId),
        index("order_items_store_idx").on(table.storeId),
        index("order_items_tenant_idx").on(table.tenantId),
    ]
);

/**
 * Order Addresses
 * Shipping and billing addresses for orders
 */
export const orderAddresses = pgTable(
    "order_addresses",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        tenantId: uuid("tenant_id")
            .notNull()
            .references(() => tenants.id, { onDelete: "cascade" }),
        storeId: uuid("store_id")
            .notNull()
            .references(() => stores.id, { onDelete: "cascade" }),
        orderId: uuid("order_id")
            .notNull()
            .references(() => orders.id, { onDelete: "cascade" }),
        
        type: orderAddressType("type").notNull(), // 'shipping' or 'billing'
        
        name: text("name"),
        phone: text("phone"),
        email: text("email"),
        
        countryCode: text("country_code").notNull().default("KE"),
        city: text("city"),
        region: text("region"),
        postalCode: text("postal_code"),
        addressLine1: text("address_line_1"),
        addressLine2: text("address_line_2"),
        
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => [
        unique("order_addresses_order_type_unique").on(table.orderId, table.type),
        index("order_addresses_order_idx").on(table.orderId),
        index("order_addresses_store_idx").on(table.storeId),
        index("order_addresses_tenant_idx").on(table.tenantId),
    ]
);

/**
 * Order Status Events
 * Audit log of all status changes and events
 */
export const orderStatusEvents = pgTable(
    "order_status_events",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        tenantId: uuid("tenant_id")
            .notNull()
            .references(() => tenants.id, { onDelete: "cascade" }),
        storeId: uuid("store_id")
            .notNull()
            .references(() => stores.id, { onDelete: "cascade" }),
        orderId: uuid("order_id")
            .notNull()
            .references(() => orders.id, { onDelete: "cascade" }),
        
        eventType: text("event_type").notNull(), // 'status_change', 'payment_received', 'shipped', etc.
        fromValue: text("from_value"),
        toValue: text("to_value"),
        note: text("note"),
        
        createdByUserId: text("created_by_user_id")
            .references(() => users.id, { onDelete: "set null" }),
        
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => [
        index("order_status_events_order_idx").on(table.orderId),
        index("order_status_events_store_idx").on(table.storeId),
        index("order_status_events_tenant_idx").on(table.tenantId),
        index("order_status_events_created_at_idx").on(table.createdAt),
    ]
);

/**
 * Transactions
 * Financial transaction records for orders (payments, refunds, etc.)
 */
export const transactions = pgTable(
    "transactions",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        tenantId: uuid("tenant_id")
            .notNull()
            .references(() => tenants.id, { onDelete: "cascade" }),
        storeId: uuid("store_id")
            .notNull()
            .references(() => stores.id, { onDelete: "cascade" }),
        orderId: uuid("order_id")
            .references(() => orders.id, { onDelete: "set null" }),
        customerId: uuid("customer_id")
            .references(() => storeCustomers.id, { onDelete: "set null" }),
        
        // Transaction details
        transactionNumber: text("transaction_number").notNull(),
        type: text("type").notNull(), // 'payment', 'refund', 'chargeback', 'adjustment'
        status: text("status").notNull(), // 'pending', 'completed', 'failed', 'cancelled'
        
        // Financial
        amount: integer("amount").notNull(),
        currency: text("currency").notNull().default("KES"),
        fee: integer("fee").default(0), // Payment gateway fees
        netAmount: integer("net_amount").notNull(), // amount - fee
        
        // Payment method
        paymentMethod: text("payment_method"), // 'mpesa', 'card', 'bank_transfer', 'cash', etc.
        paymentProvider: text("payment_provider"), // 'stripe', 'paystack', 'flutterwave', etc.
        
        // External reference
        externalId: text("external_id"), // Payment provider transaction ID
        externalStatus: text("external_status"),
        
        // Metadata
        metadata: jsonb("metadata"), // Additional payment provider data
        errorMessage: text("error_message"),
        
        // Timestamps
        processedAt: timestamp("processed_at"),
        settledAt: timestamp("settled_at"),
        
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        unique("transactions_tenant_transaction_number_unique").on(
            table.tenantId,
            table.transactionNumber
        ),
        index("transactions_tenant_idx").on(table.tenantId),
        index("transactions_store_idx").on(table.storeId),
        index("transactions_order_idx").on(table.orderId),
        index("transactions_customer_idx").on(table.customerId),
        index("transactions_type_idx").on(table.type),
        index("transactions_status_idx").on(table.status),
        index("transactions_payment_method_idx").on(table.paymentMethod),
        index("transactions_external_id_idx").on(table.externalId),
        index("transactions_created_at_idx").on(table.createdAt),
        index("transactions_processed_at_idx").on(table.processedAt),
    ]
);

/**
 * Refunds
 * Refund records linked to orders and transactions
 */
export const refunds = pgTable(
    "refunds",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        tenantId: uuid("tenant_id")
            .notNull()
            .references(() => tenants.id, { onDelete: "cascade" }),
        storeId: uuid("store_id")
            .notNull()
            .references(() => stores.id, { onDelete: "cascade" }),
        orderId: uuid("order_id")
            .notNull()
            .references(() => orders.id, { onDelete: "cascade" }),
        transactionId: uuid("transaction_id")
            .references(() => transactions.id, { onDelete: "set null" }),
        
        refundNumber: text("refund_number").notNull(),
        
        amount: integer("amount").notNull(),
        currency: text("currency").notNull().default("KES"),
        
        reason: text("reason"), // 'customer_request', 'damaged_product', 'wrong_item', etc.
        note: text("note"),
        
        status: text("status").notNull(), // 'pending', 'completed', 'failed'
        
        processedBy: text("processed_by")
            .references(() => users.id, { onDelete: "set null" }),
        
        processedAt: timestamp("processed_at"),
        
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        unique("refunds_tenant_refund_number_unique").on(table.tenantId, table.refundNumber),
        index("refunds_tenant_idx").on(table.tenantId),
        index("refunds_store_idx").on(table.storeId),
        index("refunds_order_idx").on(table.orderId),
        index("refunds_transaction_idx").on(table.transactionId),
        index("refunds_status_idx").on(table.status),
        index("refunds_created_at_idx").on(table.createdAt),
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
    customer: one(storeCustomers, {
        fields: [orders.customerId],
        references: [storeCustomers.id],
    }),
    user: one(users, {
        fields: [orders.userId],
        references: [users.id],
    }),
    items: many(orderItems),
    addresses: many(orderAddresses),
    statusEvents: many(orderStatusEvents),
    transactions: many(transactions),
    refunds: many(refunds),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
    tenant: one(tenants, {
        fields: [orderItems.tenantId],
        references: [tenants.id],
    }),
    store: one(stores, {
        fields: [orderItems.storeId],
        references: [stores.id],
    }),
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
    tenant: one(tenants, {
        fields: [orderAddresses.tenantId],
        references: [tenants.id],
    }),
    store: one(stores, {
        fields: [orderAddresses.storeId],
        references: [stores.id],
    }),
    order: one(orders, {
        fields: [orderAddresses.orderId],
        references: [orders.id],
    }),
}));

export const orderStatusEventsRelations = relations(orderStatusEvents, ({ one }) => ({
    tenant: one(tenants, {
        fields: [orderStatusEvents.tenantId],
        references: [tenants.id],
    }),
    store: one(stores, {
        fields: [orderStatusEvents.storeId],
        references: [stores.id],
    }),
    order: one(orders, {
        fields: [orderStatusEvents.orderId],
        references: [orders.id],
    }),
    createdBy: one(users, {
        fields: [orderStatusEvents.createdByUserId],
        references: [users.id],
    }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
    tenant: one(tenants, {
        fields: [transactions.tenantId],
        references: [tenants.id],
    }),
    store: one(stores, {
        fields: [transactions.storeId],
        references: [stores.id],
    }),
    order: one(orders, {
        fields: [transactions.orderId],
        references: [orders.id],
    }),
    customer: one(storeCustomers, {
        fields: [transactions.customerId],
        references: [storeCustomers.id],
    }),
}));

export const refundsRelations = relations(refunds, ({ one }) => ({
    tenant: one(tenants, {
        fields: [refunds.tenantId],
        references: [tenants.id],
    }),
    store: one(stores, {
        fields: [refunds.storeId],
        references: [stores.id],
    }),
    order: one(orders, {
        fields: [refunds.orderId],
        references: [orders.id],
    }),
    transaction: one(transactions, {
        fields: [refunds.transactionId],
        references: [transactions.id],
    }),
    processedByUser: one(users, {
        fields: [refunds.processedBy],
        references: [users.id],
    }),
}));

// Type exports
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;

export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;

export type OrderAddress = typeof orderAddresses.$inferSelect;
export type NewOrderAddress = typeof orderAddresses.$inferInsert;

export type OrderStatusEvent = typeof orderStatusEvents.$inferSelect;
export type NewOrderStatusEvent = typeof orderStatusEvents.$inferInsert;

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;

export type Refund = typeof refunds.$inferSelect;
export type NewRefund = typeof refunds.$inferInsert;