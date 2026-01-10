import { pgEnum } from "drizzle-orm/pg-core";

export const paymentStatus = pgEnum("payment_status", [
    "pending",
    "authorized",
    "captured",
    "failed",
    "refunded",
    "partially_refunded",
    "voided"
]);

export const paymentMethod = pgEnum("payment_method", [
    "mpesa",
    "credit_card",
    "debit_card",
    "cash",
    "bank_transfer"
]);

export const paymentProvider = pgEnum("payment_provider", [
    "mpesa_express",
    "stripe",
    "paypal",
    "offline"
]);
