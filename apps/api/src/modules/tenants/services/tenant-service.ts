import { db } from "@vendly/db/db";
import { tenants, tenantMemberships } from "@vendly/db/schema";
import { eq, and } from "drizzle-orm";

export class TenantService {
    /**
     * Get tenant by ID (with access check)
     */
    async getTenantById(tenantId: string, userId: string) {
        // Check if user has access to this tenant
        const membership = await db
            .select()
            .from(tenantMemberships)
            .where(
                and(
                    eq(tenantMemberships.tenantId, tenantId),
                    eq(tenantMemberships.userId, userId)
                )
            )
            .limit(1);

        if (membership.length === 0) {
            return null;
        }

        // Get tenant
        const [tenant] = await db
            .select()
            .from(tenants)
            .where(eq(tenants.id, tenantId))
            .limit(1);

        return tenant;
    }

    /**
     * Get all tenants for a user
     */
    async getUserTenants(userId: string) {
        const memberships = await db
            .select({
                tenant: tenants,
                role: tenantMemberships.role,
            })
            .from(tenantMemberships)
            .innerJoin(tenants, eq(tenantMemberships.tenantId, tenants.id))
            .where(eq(tenantMemberships.userId, userId));

        return memberships;
    }

    /**
     * Update tenant (with access check)
     */
    async updateTenant(tenantId: string, userId: string, updates: Partial<typeof tenants.$inferInsert>) {
        // Check if user has access to this tenant
        const membership = await db
            .select()
            .from(tenantMemberships)
            .where(
                and(
                    eq(tenantMemberships.tenantId, tenantId),
                    eq(tenantMemberships.userId, userId)
                )
            )
            .limit(1);

        if (membership.length === 0) {
            throw new Error("Tenant not found or access denied");
        }

        // Update tenant
        const [updatedTenant] = await db
            .update(tenants)
            .set({
                ...updates,
                updatedAt: new Date(),
            })
            .where(eq(tenants.id, tenantId))
            .returning();

        return updatedTenant;
    }
}

export const tenantService = new TenantService();
