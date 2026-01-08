import { pgEnum } from "drizzle-orm/pg-core";

export const cartStatus = pgEnum("cart_status", ["active", "converted", "abandoned"]);
