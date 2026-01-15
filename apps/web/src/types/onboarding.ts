export interface OnboardingFormData {
    // Personal Details
    fullName: string;
    phone: string;

    // Business Info
    businessType: ('online' | 'in-person')[];  // Can be both
    location?: string;
    categories: string[];

    // Store Setup
    storeName: string;
    tenantSlug: string;
    description?: string;
}

export interface OnboardingResponse {
    success: boolean;
    tenantId: string;
    storeId: string;
    subdomain: string;
    adminUrl: string;
    storefrontUrl: string;
}

export type OnboardingStep = 'personal' | 'business' | 'store-setup' | 'preview' | 'success';
