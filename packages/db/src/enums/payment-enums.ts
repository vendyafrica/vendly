import { pgEnum } from "drizzle-orm/pg-core";

export const paymentProvider = pgEnum("payment_provider", ["mpesa", "stripe", "flutterwave", "manual"]);

export const paymentIntentStatus = pgEnum("payment_intent_status", [
  "requires_payment_method",
  "processing",
  "succeeded",
  "failed",
  "cancelled",
]);

export const paymentAttemptStatus = pgEnum("payment_attempt_status", [
  "initiated",
  "pending",
  "succeeded",
  "failed",
]);

export const refundStatus = pgEnum("refund_status", ["pending", "succeeded", "failed"]);
