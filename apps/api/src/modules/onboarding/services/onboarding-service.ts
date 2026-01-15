import { db } from "@vendly/db/db";
import { tenants, tenantMemberships, stores } from "@vendly/db/schema";
import { eq } from "drizzle-orm";

interface CompleteOnboardingInput {
    userId: string;
    fullName: string;
    phone: string;
    businessType: string[];
    categories: string[];
    location?: string;
    storeName: string;
    tenantSlug: string;
}

interface CompleteOnboardingResult {
    success: boolean;
    tenantId: string;
    storeId: string;
    subdomain: string;
    adminUrl: string;
    storefrontUrl: string;
}

const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:4000";
const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "vendlyafrica.store";

export class OnboardingService {
    /**
     * Complete onboarding process
     * Creates tenant, tenant membership, and store
     * Also triggers Sanity content creation
     */
    async completeOnboarding(input: CompleteOnboardingInput): Promise<CompleteOnboardingResult> {
        const {
            userId,
            fullName,
            phone,
            businessType,
            categories,
            location,
            storeName,
            tenantSlug,
        } = input;

        // Check if slug is already taken
        const existingTenant = await db
            .select()
            .from(tenants)
            .where(eq(tenants.slug, tenantSlug))
            .limit(1);

        if (existingTenant.length > 0) {
            throw new Error("Store URL already taken");
        }

        try {
            // 1. Create tenant
            const [tenant] = await db
                .insert(tenants)
                .values({
                    name: storeName,
                    slug: tenantSlug,
                    ownerName: fullName,
                    ownerPhone: phone,
                    businessType: businessType,
                    categories: categories,
                    location: location,
                    status: "onboarding",
                })
                .returning();

            // 2. Create tenant membership (link user to tenant)
            await db.insert(tenantMemberships).values({
                tenantId: tenant.id,
                userId: userId,
                role: "owner",
            });

            // 3. Create store
            const [store] = await db
                .insert(stores)
                .values({
                    tenantId: tenant.id,
                    name: storeName,
                    slug: tenantSlug,
                    sanityStoreId: tenantSlug,  // Use slug as Sanity store ID
                    sanityDesignSystem: "design-system-modern",  // Default to Modern
                    status: "draft",
                })
                .returning();

            // 4. TODO: Create Sanity content
            // This will be implemented in the next step
            // await createStoreContent({
            //     storeId: tenantSlug,
            //     storeName: storeName,
            //     designSystemId: 'design-system-modern',
            // });

            // 5. Update tenant status to active
            await db
                .update(tenants)
                .set({ status: "active" })
                .where(eq(tenants.id, tenant.id));

            return {
                success: true,
                tenantId: tenant.id,
                storeId: store.id,
                subdomain: tenantSlug,
                adminUrl: `${ADMIN_URL}/${tenantSlug}/studio`,
                storefrontUrl: `https://${tenantSlug}.${ROOT_DOMAIN}`,
            };
        } catch (error) {
            console.error("Error creating onboarding:", error);
            throw error;
        }
    }
}

export const onboardingService = new OnboardingService();
