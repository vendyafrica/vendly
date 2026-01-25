import { db } from "@vendly/db/db";
import { tenants, tenantMemberships, type Tenant, type NewTenant, type NewTenantMembership } from "@vendly/db/schema";
import { eq } from "drizzle-orm";

export const tenantRepository = {

    async create(data: NewTenant): Promise<Tenant> {
        const [tenant] = await db.insert(tenants).values(data).returning();
        return tenant;
    },

    async update(id: string, data: Partial<NewTenant>): Promise<Tenant | null> {
        const [updated] = await db
            .update(tenants)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(tenants.id, id))
            .returning();
        return updated ?? null;
    },

    async findById(id: string): Promise<Tenant | null> {
        const [tenant] = await db
            .select()
            .from(tenants)
            .where(eq(tenants.id, id))
            .limit(1);
        return tenant ?? null;
    },

    async findAll(): Promise<Tenant[]> {
        const result = await db.select().from(tenants);
        return result;
    },
}


export const membershipRepository = {
    async create(data: NewTenantMembership) {
        const [membership] = await db.insert(tenantMemberships).values(data).returning();
        return membership;
    }
};

export type TenantRepository = typeof tenantRepository;
export type MembershipRepository = typeof membershipRepository;
