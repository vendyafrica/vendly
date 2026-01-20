import { db } from "@vendly/db/db";
import { tenants, tenantMemberships, stores } from "@vendly/db/schema";
import { eq, and } from "drizzle-orm";
import type { OnboardingData, OnboardingStep } from "./onboarding-dto";

// =====================================
// Types
// =====================================

interface TenantWithOnboarding {
    id: string;
    fullName: string;
    slug: string;
    phoneNumber: string | null;
    onboardingStep: OnboardingStep;
    onboardingData: OnboardingData;
}

interface CreateTenantResult {
    tenant: typeof tenants.$inferSelect;
    store: typeof stores.$inferSelect;
    membership: typeof tenantMemberships.$inferSelect;
}

// =====================================
// Repository Class
// =====================================

class OnboardingRepository {
    /**
     * Find tenant by user membership
     */
    async findTenantByUserId(userId: string): Promise<TenantWithOnboarding | null> {
        const membership = await db.query.tenantMemberships.findFirst({
            where: eq(tenantMemberships.userId, userId),
            with: { tenant: true },
        });

        if (!membership?.tenant) return null;

        const tenant = membership.tenant;
        return {
            id: tenant.id,
            fullName: tenant.fullName,
            slug: tenant.slug,
            phoneNumber: tenant.phoneNumber,
            onboardingStep: tenant.onboardingStep as OnboardingStep,
            onboardingData: (tenant.onboardingData ?? {}) as OnboardingData,
        };
    }

    /**
     * Create initial tenant record for new user
     */
    async createInitialTenant(userId: string, email: string): Promise<TenantWithOnboarding> {
        const slug = this.generateSlug(email);

        const [tenant] = await db.insert(tenants).values({
            fullName: "",
            slug,
            onboardingStep: "personal",
            onboardingData: {},
        }).returning();

        await db.insert(tenantMemberships).values({
            tenantId: tenant.id,
            userId,
            role: "owner",
        });

        return {
            id: tenant.id,
            fullName: tenant.fullName,
            slug: tenant.slug,
            phoneNumber: tenant.phoneNumber,
            onboardingStep: tenant.onboardingStep as OnboardingStep,
            onboardingData: (tenant.onboardingData ?? {}) as OnboardingData,
        };
    }

    /**
     * Update onboarding step and data
     */
    async updateOnboardingProgress(
        tenantId: string,
        step: OnboardingStep,
        data: OnboardingData
    ): Promise<void> {
        await db.update(tenants)
            .set({
                onboardingStep: step,
                onboardingData: data,
            })
            .where(eq(tenants.id, tenantId));
    }

    /**
     * Complete onboarding - create store and update tenant
     */
    async completeOnboarding(
        tenantId: string,
        userEmail: string,
        data: Required<OnboardingData>
    ): Promise<CreateTenantResult> {
        // Slug = slugified store name
        const storeSlug = this.generateSlugFromName(data.store.storeName);

        // Update tenant with final data
        const [updatedTenant] = await db.update(tenants)
            .set({
                fullName: data.personal.fullName,
                phoneNumber: data.personal.phoneNumber,
                billingEmail: userEmail,
                onboardingStep: "complete",
                onboardingData: data,
                status: "active",
            })
            .where(eq(tenants.id, tenantId))
            .returning();

        // Create store with same email/phone as tenant
        const [store] = await db.insert(stores).values({
            tenantId,
            name: data.store.storeName,
            slug: storeSlug,
            description: data.store.storeDescription,
            categories: data.business.categories,
            email: userEmail,
            phone: data.personal.phoneNumber,
            status: true,
        }).returning();

        // Get membership
        const membership = await db.query.tenantMemberships.findFirst({
            where: eq(tenantMemberships.tenantId, tenantId),
        });

        return {
            tenant: updatedTenant,
            store,
            membership: membership!,
        };
    }

    /**
     * Check if slug exists
     */
    async isSlugTaken(slug: string): Promise<boolean> {
        const existing = await db.query.tenants.findFirst({
            where: eq(tenants.slug, slug),
        });
        return !!existing;
    }

    /**
     * Generate URL-safe slug from store name (clean, no random suffix)
     */
    private generateSlugFromName(name: string): string {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "")
            .slice(0, 50);
    }

    /**
     * Generate URL-safe slug from email (with random suffix for uniqueness)
     */
    private generateSlug(input: string): string {
        const base = input
            .toLowerCase()
            .replace(/@.*$/, "") // Remove email domain
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "")
            .slice(0, 30);

        const suffix = Math.random().toString(36).slice(2, 6);
        return `${base}-${suffix}`;
    }
}

export const onboardingRepository = new OnboardingRepository();
