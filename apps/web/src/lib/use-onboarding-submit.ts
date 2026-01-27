import { useState } from 'react';
import { OnboardingFormData, OnboardingResponse } from '../types/onboarding';
import { submitOnboarding } from '../api/onboarding';

export const useOnboardingSubmit = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submit = async (data: OnboardingFormData): Promise<OnboardingResponse | null> => {
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await submitOnboarding(data);
            return response;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Something went wrong';
            setError(message);
            return null;
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        submit,
        isSubmitting,
        error,
    };
};