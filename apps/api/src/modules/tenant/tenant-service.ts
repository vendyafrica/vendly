import { db, tenants, tenantMemberships, eq, and } from "@vendly/db";
import { CreateTenantRequest, UpdateTenantRequest, TenantResponse } from "./tenant-model";

export class TenantService {
    /**
     * Create a new tenant and link the creator as an owner
     */
    async createTenant(userId: string, data: CreateTenantRequest): Promise<TenantResponse> {
        // 1. Check if slug exists
        const [existingToken] = await db
            .select()
            .from(tenants)
            .where(eq(tenants.slug, data.slug))
            .limit(1);

        if (existingToken) {
            throw new Error(`Tenant with slug '${data.slug}' already exists`);
        }

        // 2. Create Tenant
        const [newTenant] = await db.insert(tenants).values({
            name: data.name,
            slug: data.slug,
            billingEmail: data.billingEmail,
            status: "onboarding",
            plan: "free",
        }).returning();

        // 3. Create Membership (Owner)
        await db.insert(tenantMemberships).values({
            tenantId: newTenant.id,
            userId: userId,
            role: "owner",
        });

        return {
            id: newTenant.id,
            name: newTenant.name,
            slug: newTenant.slug,
            status: newTenant.status,
            plan: newTenant.plan,
            billingEmail: newTenant.billingEmail,
            createdAt: newTenant.createdAt,
        };
    }

    /**
     * Get a tenant by slug
     * Optionally verify if the user is a member
     */
    async getTenantBySlug(slug: string, userId?: string): Promise<TenantResponse | null> {
        const [tenant] = await db
            .select()
            .from(tenants)
            .where(eq(tenants.slug, slug))
            .limit(1);

        if (!tenant) return null;

        if (userId) {
            // Verify membership
            const [membership] = await db
                .select()
                .from(tenantMemberships)
                .where(and(
                    eq(tenantMemberships.tenantId, tenant.id),
                    eq(tenantMemberships.userId, userId)
                ))
                .limit(1);

            if (!membership) {
                // Return null or throw error depending on strictness. 
                // For "Getting your own tenant", returning null is safer for security.
                return null;
            }
        }

        return {
            id: tenant.id,
            name: tenant.name,
            slug: tenant.slug,
            status: tenant.status,
            plan: tenant.plan,
            billingEmail: tenant.billingEmail,
            createdAt: tenant.createdAt,
        };
    }

    /**
     * List tenants for a user
     */
    async listUserTenants(userId: string): Promise<TenantResponse[]> {
        // Use explicit join to fetch tenants for the user
        const results = await db
            .select({
                tenant: tenants
            })
            .from(tenantMemberships)
            .innerJoin(tenants, eq(tenantMemberships.tenantId, tenants.id))
            .where(eq(tenantMemberships.userId, userId));

        return results.map((r) => ({
            id: r.tenant.id,
            name: r.tenant.name,
            slug: r.tenant.slug,
            status: r.tenant.status,
            plan: r.tenant.plan,
            billingEmail: r.tenant.billingEmail,
            createdAt: r.tenant.createdAt,
        }));
    }
}

export const tenantService = new TenantService();
