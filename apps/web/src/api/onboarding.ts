import { OnboardingFormData, OnboardingResponse } from "../types/onboarding";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

export const submitOnboarding = async (
    data: OnboardingFormData
): Promise<OnboardingResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/onboarding/complete`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'Failed to complete onboarding');
    }

    return response.json();
};