import { OnboardingFormData } from "../types/onboarding";

export const validatePersonalStep = (data: Partial<OnboardingFormData>) => {
    const errors: string[] = [];

    if (!data.fullName?.trim()) {
        errors.push("Full name is required");
    }

    if (!data.phone?.trim() || data.phone.length < 10) {
        errors.push("Valid phone number is required");
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

export const validateBusinessStep = (data: Partial<OnboardingFormData>) => {
    const errors: string[] = [];

    if (!data.categories || data.categories.length === 0) {
        errors.push("Select at least one category");
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

export const validateStoreStep = (data: Partial<OnboardingFormData>) => {
    const errors: string[] = [];

    if (!data.storeName?.trim()) {
        errors.push("Store name is required");
    }

    if (!data.tenantSlug?.trim() || data.tenantSlug.length < 3) {
        errors.push("Store URL must be at least 3 characters");
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};