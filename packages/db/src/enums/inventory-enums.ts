import { pgEnum } from "drizzle-orm/pg-core";

export const inventoryMovementType = pgEnum("inventory_movement_type", [
  "sale",
  "restock",
  "return",
]);
