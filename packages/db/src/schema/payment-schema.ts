import { relations } from "drizzle-orm";
import {
    pgTable,
    text,
    timestamp,
    uuid,
    integer,
    boolean,
    index,
    unique,
    jsonb,
} from "drizzle-orm/pg-core";

import { tenants } from "./core-schema";
import { orders } from "./order-schema";
import {
    paymentProvider,
    paymentIntentStatus,
    paymentAttemptStatus,
    refundStatus,
} from "../enums/payment-enums";

export const paymentProviders = pgTable(
    "payment_providers",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        tenantId: uuid("tenant_id")
            .notNull()
            .references(() => tenants.id, { onDelete: "cascade" }),
        provider: paymentProvider("provider").notNull(),
        isEnabled: boolean("is_enabled").notNull().default(false),
        config: jsonb("config"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        unique("payment_providers_tenant_provider_unique").on(table.tenantId, table.provider),
        index("payment_providers_tenant_idx").on(table.tenantId),
    ],
);

export const paymentIntents = pgTable(
    "payment_intents",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        tenantId: uuid("tenant_id")
            .notNull()
            .references(() => tenants.id, { onDelete: "cascade" }),
        orderId: uuid("order_id")
            .notNull()
            .references(() => orders.id, { onDelete: "cascade" }),
        provider: paymentProvider("provider").notNull(),

        amount: integer("amount").notNull(),
        currency: text("currency").notNull().default("KES"),

        status: paymentIntentStatus("status").notNull().default("requires_payment_method"),
        providerReference: text("provider_reference"),
        idempotencyKey: text("idempotency_key"),

        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        index("payment_intents_order_idx").on(table.orderId),
        index("payment_intents_tenant_idx").on(table.tenantId),
        index("payment_intents_status_idx").on(table.status),
        unique("payment_intents_tenant_idempotency_unique").on(table.tenantId, table.idempotencyKey),
    ],
);

export const paymentAttempts = pgTable(
    "payment_attempts",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        tenantId: uuid("tenant_id")
            .notNull()
            .references(() => tenants.id, { onDelete: "cascade" }),
        paymentIntentId: uuid("payment_intent_id")
            .notNull()
            .references(() => paymentIntents.id, { onDelete: "cascade" }),
        status: paymentAttemptStatus("status").notNull().default("initiated"),
        providerReference: text("provider_reference"),
        raw: jsonb("raw"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => [
        index("payment_attempts_intent_idx").on(table.paymentIntentId),
        index("payment_attempts_tenant_idx").on(table.tenantId),
    ],
);

export const refunds = pgTable(
    "refunds",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        tenantId: uuid("tenant_id")
            .notNull()
            .references(() => tenants.id, { onDelete: "cascade" }),
        orderId: uuid("order_id")
            .notNull()
            .references(() => orders.id, { onDelete: "cascade" }),
        paymentIntentId: uuid("payment_intent_id").references(() => paymentIntents.id, { onDelete: "set null" }),

        amount: integer("amount").notNull(),
        currency: text("currency").notNull().default("KES"),

        status: refundStatus("status").notNull().default("pending"),
        providerReference: text("provider_reference"),
        raw: jsonb("raw"),

        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        index("refunds_order_idx").on(table.orderId),
        index("refunds_tenant_idx").on(table.tenantId),
        index("refunds_status_idx").on(table.status),
    ],
);

// Relations
export const paymentProvidersRelations = relations(paymentProviders, ({ one }) => ({
    tenant: one(tenants, {
        fields: [paymentProviders.tenantId],
        references: [tenants.id],
    }),
}));

export const paymentIntentsRelations = relations(paymentIntents, ({ one, many }) => ({
    order: one(orders, {
        fields: [paymentIntents.orderId],
        references: [orders.id],
    }),
    attempts: many(paymentAttempts),
}));

export const paymentAttemptsRelations = relations(paymentAttempts, ({ one }) => ({
    intent: one(paymentIntents, {
        fields: [paymentAttempts.paymentIntentId],
        references: [paymentIntents.id],
    }),
}));

export const refundsRelations = relations(refunds, ({ one }) => ({
    order: one(orders, {
        fields: [refunds.orderId],
        references: [orders.id],
    }),
    intent: one(paymentIntents, {
        fields: [refunds.paymentIntentId],
        references: [paymentIntents.id],
    }),
}));

// Types
export type PaymentProvider = typeof paymentProviders.$inferSelect;
export type PaymentIntent = typeof paymentIntents.$inferSelect;
export type PaymentAttempt = typeof paymentAttempts.$inferSelect;
export type Refund = typeof refunds.$inferSelect;
