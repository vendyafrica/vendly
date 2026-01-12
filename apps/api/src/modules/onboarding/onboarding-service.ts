import { OnboardingRequest, OnboardingResponse } from "./onboarding-types";
import {
    buildTenantData,
    buildStoreData,
    buildThemeConfig,
    buildStoreContent,
    buildOnboardingResponse,
} from "./onboarding-builder";
import {
    findTenantBySlug,
    createTenant,
    createTenantMembership,
    findTemplateBySlug,
    createStore,
    createStoreMembership,
    createStoreTheme,
    createStoreContent,
} from "@vendly/db";

import { sendWelcomeEmail } from "@vendly/transactional";

// Non-blocking side effects
const syncInstagramSafe = async (tenantSlug: string, userId: string) => {
    try {
        const { instagramService } = await import("../instagram/instagram-service");

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

// Main service function
export const completeOnboarding = async (
    userId: string,
    userEmail: string,
    request: OnboardingRequest
): Promise<OnboardingResponse> => {
    // 1. Check if tenant exists
    const existingTenant = await findTenantBySlug(request.tenantSlug);
    if (existingTenant) {
        throw new Error("Store URL already taken");
    }

    // 2. Create tenant
    const tenantData = buildTenantData(request, userEmail);
    const tenant = await createTenant(tenantData);
    await createTenantMembership(tenant.id, userId);

    // 3. Create store
    const templateId = request.themeId
        ? (await findTemplateBySlug(request.themeId))?.id
        : null;

    const storeData = buildStoreData(request, tenant.id);
    const store = await createStore(storeData);
    await createStoreMembership(tenant.id, store.id, userId);

    // 4. Create theme and content
    const themeConfig = buildThemeConfig(tenant.id, store.id);
    const contentConfig = buildStoreContent(tenant.id, store.id, request.storeName);

    await Promise.all([
        createStoreTheme(themeConfig),
        createStoreContent(contentConfig),
    ]);

    // 5. Non-blocking side effects
    Promise.all([
        syncInstagramSafe(tenant.slug, userId),
        sendWelcomeEmailSafe(userEmail, request.fullName, tenant.slug),
    ]).catch(error => console.error("Post-onboarding tasks failed:", error));

    // 6. Build response
    return buildOnboardingResponse(tenant, store);
};