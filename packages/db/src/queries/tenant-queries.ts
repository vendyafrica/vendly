import { db, tenants, tenantMemberships, eq } from "@vendly/db";
import { NewTenant } from "../schema/tenant-schema";

export const findTenantBySlug = async (slug: string) => {
    return await db.query.tenants.findFirst({
        where: eq(tenants.slug, slug)
    });
};

export const createTenant = async (data: NewTenant) => {
    const [tenant] = await db.insert(tenants).values(data).returning();
    return tenant;
};

export const createTenantMembership = async (
    tenantId: string,
    userId: string,
    role: "owner" = "owner"
) => {
    await db.insert(tenantMemberships).values({
        tenantId,
        userId,
        role,
    });
};
