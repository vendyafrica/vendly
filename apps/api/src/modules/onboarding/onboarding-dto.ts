// =====================================
// Onboarding Step Types
// =====================================

export type OnboardingStep = "signup" | "personal" | "store" | "business" | "complete";

// =====================================
// Step-specific DTOs
// =====================================

export interface PersonalInfoDto {
    fullName: string;
    phoneNumber: string;
}

export interface StoreInfoDto {
    storeName: string;
    storeDescription: string;
}

export interface BusinessInfoDto {
    categories: string[];
}

// =====================================
// Combined Onboarding Data
// =====================================

export interface OnboardingData {
    personal?: PersonalInfoDto;
    store?: StoreInfoDto;
    business?: BusinessInfoDto;
}

// =====================================
// API Response Types
// =====================================

export interface OnboardingStatusResponse {
    currentStep: OnboardingStep;
    data: OnboardingData;
    isComplete: boolean;
}

export interface StepSaveResponse {
    success: boolean;
    nextStep: OnboardingStep;
    message: string;
}

export interface OnboardingCompleteResponse {
    success: boolean;
    tenantId: string;
    storeId: string;
    storeSlug: string;
    message: string;
}

// =====================================
// Validation Helpers
// =====================================

export function isValidPersonalInfo(data: unknown): data is PersonalInfoDto {
    if (!data || typeof data !== "object") return false;
    const d = data as Record<string, unknown>;
    return (
        typeof d.fullName === "string" &&
        d.fullName.trim().length > 0 &&
        typeof d.phoneNumber === "string" &&
        d.phoneNumber.trim().length > 0
    );
}

export function isValidStoreInfo(data: unknown): data is StoreInfoDto {
    if (!data || typeof data !== "object") return false;
    const d = data as Record<string, unknown>;
    return (
        typeof d.storeName === "string" &&
        d.storeName.trim().length > 0 &&
        typeof d.storeDescription === "string"
    );
}

export function isValidBusinessInfo(data: unknown): data is BusinessInfoDto {
    if (!data || typeof data !== "object") return false;
    const d = data as Record<string, unknown>;
    return (
        Array.isArray(d.categories) &&
        d.categories.length > 0 &&
        d.categories.every((c: unknown) => typeof c === "string")
    );
}
