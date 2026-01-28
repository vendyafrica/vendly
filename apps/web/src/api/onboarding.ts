import { OnboardingFormData, OnboardingResponse } from "../types/onboarding";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

export const submitOnboarding = async (
    data: OnboardingFormData
): Promise<OnboardingResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/onboarding/complete`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
            fullName: data.fullName,
            phone: data.phone,
            businessType: data.businessType,
            categories: data.categories,
            location: data.location,
            storeName: data.storeName,
            tenantSlug: data.tenantSlug,
        }),
    });

    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'Failed to complete onboarding');
    }

    return response.json();
};