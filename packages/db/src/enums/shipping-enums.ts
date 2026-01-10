import { pgEnum } from "drizzle-orm/pg-core";


export const shipmentStatus = pgEnum("shipment_status", [
    "pending",
    "label_created",
    "picked_up",
    "in_transit",
    "out_for_delivery",
    "delivered",
    "failed_delivery",
    "returned",
    "cancelled",
]);