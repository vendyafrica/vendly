import { pgEnum } from "drizzle-orm/pg-core";

export const tenantRole = pgEnum("tenant_role", ["owner", "support"]);

export const tenantStatus = pgEnum("tenant_status", ["active", "suspended", "onboarding"]);

export const platformAdminRole = pgEnum("platform_admin_role", ["super_admin", "platform_support"]);
