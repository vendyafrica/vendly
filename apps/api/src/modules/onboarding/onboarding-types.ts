export interface OnboardingRequest {
    fullName: string;
    phone: string;
    categories: string[];
    storeName: string;
    description?: string;
    tenantSlug: string;
    themeId?: string;
    location?: string;
    socialLinks?: {
        instagram?: string;
        facebook?: string;
        twitter?: string;
    };
}

export interface OnboardingResponse {
    tenantId: string;
    storeId: string;
    subdomain: string;
    adminUrl: string;
}

export interface TenantData {
    name: string;
    slug: string;
    phoneNumber: string;
    billingEmail: string;
    status: "active";
    plan: "free";
}

export interface StoreData {
    tenantId: string;
    name: string;
    slug: string;
    description: string;
    status: "active";
    defaultCurrency: "KES";
}