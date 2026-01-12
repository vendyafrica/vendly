import { OnboardingRequest, OnboardingResponse } from "./onboarding-types";
import {
    buildTenantData,
    buildOnboardingResponse,
} from "./onboarding-builder";
import {
    findTenantBySlug,
    createTenant,
    createTenantMembership,
    createStoreMembership,
    edgeDb,
} from "@vendly/db";
import { createStorefront } from "../storefront/storefront-service";
import { sendWelcomeEmail } from "@vendly/transactional";

// Non-blocking side effects
const syncInstagramSafe = async (tenantSlug: string, userId: string) => {
    try {
        const { getInstagramService } = await import("../instagram/instagram-service");
        const instagramService = getInstagramService(edgeDb);
        await instagramService.initializeIntegration(tenantSlug, userId);
        console.log("Instagram Sync triggered for tenant:", tenantSlug);
    } catch (error) {
        console.error("Failed to trigger Instagram sync:", error);
    }
};

const sendWelcomeEmailSafe = async (
    userEmail: string,
    fullName: string,
    tenantSlug: string
) => {
    try {
        await sendWelcomeEmail({
            to: userEmail,
            name: fullName,
            dashboardUrl: `http://admin.localhost:3000/${tenantSlug}`,
        });
    } catch (error) {
        console.error("Failed to send welcome email:", error);
    }
};

// Main onboarding service
export const completeOnboarding = async (
    userId: string,
    userEmail: string,
    request: OnboardingRequest
): Promise<OnboardingResponse> => {
    // 1. Validate tenant doesn't exist
    const existingTenant = await findTenantBySlug(request.tenantSlug);
    if (existingTenant) {
        throw new Error("Store URL already taken");
    }

    // 2. Create tenant
    const tenantData = buildTenantData(request, userEmail);
    const tenant = await createTenant(tenantData);
    await createTenantMembership(tenant.id, userId);

    // 3. Create complete storefront (store + theme + content)
    const storefront = await createStorefront({
        tenantId: tenant.id,
        storeName: request.storeName,
        storeSlug: request.tenantSlug,
        description: request.description,
        themeId: request.themeId,
        categories: request.categories,
        location: request.location,
        socialLinks: request.socialLinks,
    });

    // 4. Create store membership
    await createStoreMembership(tenant.id, storefront.id, userId);

    // 5. Non-blocking side effects
    Promise.all([
        syncInstagramSafe(tenant.slug, userId),
        sendWelcomeEmailSafe(userEmail, request.fullName, tenant.slug),
    ]).catch(error => console.error("Post-onboarding tasks failed:", error));

    // 6. Build response
    return buildOnboardingResponse(tenant, { id: storefront.id });
};