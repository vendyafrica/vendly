export interface OnboardingFormData {
    fullName: string;
    phone: string;
    businessType: string;
    categories: string[];
    location: string;
    storeName: string;
    tenantSlug: string;
}

export interface OnboardingResponse {
    success: boolean;
    message?: string;
    tenantId?: string;
    storeSlug?: string;
}
