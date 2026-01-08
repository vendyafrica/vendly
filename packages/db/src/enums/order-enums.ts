import { pgEnum } from "drizzle-orm/pg-core";

export const orderStatus = pgEnum("order_status", ["draft", "placed", "cancelled", "completed"]);

export const paymentStatus = pgEnum("payment_status", [
  "unpaid",
  "authorized",
  "paid",
  "partially_refunded",
  "refunded",
  "failed",
]);

export const fulfillmentStatus = pgEnum("fulfillment_status", [
  "unfulfilled",
  "fulfilled",
  "shipped",
  "delivered",
  "returned",
]);

export const orderAddressType = pgEnum("order_address_type", ["billing", "shipping"]);
