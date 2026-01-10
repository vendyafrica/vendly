import { pgEnum } from "drizzle-orm/pg-core";

export const tenantStatus = pgEnum("tenant_status", [
    "onboarding",
    "active",
    "suspended",
    "cancelled",
]);

export const tenantRole = pgEnum("tenant_role", [
    "owner",
    "admin",
    "member",
    "viewer",
]);

export const platformAdminRole = pgEnum("platform_admin_role", [
    "platform_super_admin",
    "platform_admin",
    "platform_support",
]);