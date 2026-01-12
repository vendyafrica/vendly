import { OnboardingRequest, TenantData, StoreData, OnboardingResponse } from "./onboarding-types";

export const buildTenantData = (
    request: OnboardingRequest,
    userEmail: string
): TenantData => ({
    name: request.storeName,
    slug: request.tenantSlug,
    phoneNumber: request.phone,
    billingEmail: userEmail,
    status: "active",
    plan: "free",
});

export const buildStoreData = (
    request: OnboardingRequest,
    tenantId: string
): StoreData => ({
    tenantId,
    name: request.storeName,
    slug: request.tenantSlug,
    description: request.description || "",
    status: "active",
    defaultCurrency: "KES",
});

export const buildThemeConfig = (tenantId: string, storeId: string) => ({
    tenantId,
    storeId,
    preset: "minimal" as const,
    colors: {
        primary: '#285570',
        secondary: '#e3ded7',
        background: '#faf7f6',
        foreground: '#333333',
        muted: '#e3ded7',
        mutedForeground: '#666666',
        border: '#cbcac7',
        input: '#ffffff',
        ring: '#285570',
    },
    typography: {
        fontFamily: 'Inter',
        headingFont: 'Playfair Display',
        bodyFont: 'Inter',
    },
    layout: {
        containerWidth: 'wide' as const,
        borderRadius: 'none' as const,
    },
    components: {
        buttonStyle: 'solid' as const,
        cardStyle: 'flat' as const,
    }
});

export const buildStoreContent = (
    tenantId: string,
    storeId: string,
    storeName: string
) => ({
    tenantId,
    storeId,
    hero: {
        enabled: true,
        layout: "centered" as const,
        title: "Get inspired",
        subtitle: "Discover our latest collection of premium Italian designs.",
        ctaText: "Shop Collection",
        ctaLink: "/shop",
        backgroundOverlay: true,
    },
    sections: [
        {
            id: "featured-collection",
            type: "products" as const,
            title: "Winter Collection",
            enabled: true,
            settings: {
                layout: "grid" as const,
                columns: 3 as const,
                showPrices: true,
            }
        },
        {
            id: "brand-story",
            type: "banner" as const,
            title: "Our Story",
            subtitle: "Crafted with passion in the heart of Italy.",
            enabled: true,
        }
    ],
    footer: {
        showSocialLinks: true,
        showNewsletter: true,
        newsletterTitle: "Join the community",
        copyright: `© ${new Date().getFullYear()} ${storeName}. All rights reserved.`,
    }
});

export const buildOnboardingResponse = (
    tenant: { id: string; slug: string },
    store: { id: string }
): OnboardingResponse => ({
    tenantId: tenant.id,
    storeId: store.id,
    subdomain: tenant.slug,
    adminUrl: `http://admin.localhost:3000/${tenant.slug}/store`
});