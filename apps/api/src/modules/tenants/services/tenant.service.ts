import { tenantRepository, membershipRepository, type TenantRepository, type MembershipRepository } from "../repositories/tenant.repository";

export class TenantService {
    constructor(
        private tenantRepo: TenantRepository = tenantRepository,
        private membershipRepo: MembershipRepository = membershipRepository
    ) { }

    async createTenant(userId: string, name: string, slug: string) {
        // 1. Check if slug exists
        const existing = await this.tenantRepo.findBySlug(slug);
        if (existing) {
            throw new Error(`Tenant with slug '${slug}' already exists`);
        }

        // 2. Create tenant
        const tenant = await this.tenantRepo.create({
            name,
            slug,
            status: "active", // or 'onboarding'
        });

        // 3. Create membership for owner
        await this.membershipRepo.create({
            tenantId: tenant.id,
            userId,
            role: "owner",
        });

        return tenant;
    }

    async getTenant(id: string) {
        return this.tenantRepo.findById(id);
    }
}

export const tenantService = new TenantService();
