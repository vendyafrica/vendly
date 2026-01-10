import { pgEnum } from "drizzle-orm/pg-core";



export const orderStatus = pgEnum("order_status", [
    "draft",
    "pending",
    "processing",
    "confirmed",
    "completed",
    "cancelled",
    "refunded",
]);

export const paymentStatus = pgEnum("payment_status", [
    "unpaid",
    "pending",
    "authorized",
    "paid",
    "partially_paid",
    "partially_refunded",
    "refunded",
    "failed",
]);

export const fulfillmentStatus = pgEnum("fulfillment_status", [
    "unfulfilled",
    "partially_fulfilled",
    "fulfilled",
    "returned",
    "cancelled",
]);

export const orderAddressType = pgEnum("order_address_type", [
    "shipping",
    "billing",
]);