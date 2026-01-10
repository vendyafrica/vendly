import { pgEnum } from "drizzle-orm/pg-core";


export const productStatus = pgEnum("product_status", [
    "active",
    "archived",
    "draft",
]);