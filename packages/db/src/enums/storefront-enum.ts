import { pgEnum } from "drizzle-orm/pg-core";

export const storeStatus = pgEnum("store_status", [
    "active",
    "suspended",
    "draft",
]);

export const storeRole = pgEnum("store_role", [
    "store_owner",
    "manager",
    "seller",
    "viewer",
]);

export const themePreset = pgEnum("theme_preset", [
    "minimal",
    "bold",
    "elegant",
    "modern",
    "vintage",
    "playful",
]);