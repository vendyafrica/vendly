import { pgEnum } from "drizzle-orm/pg-core";


export const inventoryMovementType = pgEnum("inventory_movement_type", [
    "purchase", // Stock received from supplier
    "sale", // Stock sold to customer
    "return", // Customer return
    "adjustment", // Manual adjustment
    "damage", // Damaged goods
    "loss", // Lost/stolen
    "transfer", // Transfer between locations
    "reserved", // Reserved for order
    "unreserved", // Reservation released
]);