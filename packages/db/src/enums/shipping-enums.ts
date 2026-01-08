import { pgEnum } from "drizzle-orm/pg-core";

export const shipmentStatus = pgEnum("shipment_status", [
  "pending",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
]);
