export interface OnboardingFormData {
    fullName: string;
    phone: string;
    categories: string[];
    description: string;
    storeName: string;
    tenantSlug: string;
    themeId: string;
    location?: string;
    socialLinks?: {
        instagram?: string;
        facebook?: string;
        twitter?: string;
    };
}

export interface OnboardingResponse {
    success: boolean;
    tenantId: string;
    storeId: string;
    subdomain: string;
    adminUrl: string;
}

export type OnboardingStep = 'personal' | 'business' | 'store-setup' | 'success';