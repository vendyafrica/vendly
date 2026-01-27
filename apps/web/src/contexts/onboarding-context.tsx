'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useOnboardingForm } from '../lib/use-onboarding-form';
import { OnboardingFormData } from '../types/onboarding';

interface OnboardingContextValue {
    data: OnboardingFormData;
    updateData: (updates: Partial<OnboardingFormData>) => void;
    resetData: () => void;
}

const OnboardingContext = createContext<OnboardingContextValue | undefined>(undefined);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
    const formState = useOnboardingForm();

    return (
        <OnboardingContext.Provider value={formState}>
            {children}
        </OnboardingContext.Provider>
    );
};

export const useOnboarding = () => {
    const context = useContext(OnboardingContext);
    if (!context) {
        throw new Error('useOnboarding must be used within OnboardingProvider');
    }
    return context;
};
