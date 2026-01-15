export interface CompleteOnboardingResult {
    success: boolean;
    tenantId: string;
    storeId: string;
    subdomain: string;
    adminUrl: string;
    storefrontUrl: string;
}

export interface CompleteOnboardingInput {
    userId: string;
    fullName: string;
    phone: string;
    businessType: string;
    categories: string[];
    location: string;
    storeName: string;
    tenantSlug: string;
}