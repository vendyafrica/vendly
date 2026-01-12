import { useState, useCallback } from 'react';
import { OnboardingFormData } from '../types/onboarding';

const initialData: OnboardingFormData = {
    fullName: '',
    phone: '',
    categories: [],
    description: '',
    storeName: '',
    tenantSlug: '',
    themeId: 'velasca',
    location: '',
};

export const useOnboardingForm = () => {
    const [data, setData] = useState<OnboardingFormData>(initialData);

    const updateData = useCallback((updates: Partial<OnboardingFormData>) => {
        setData(prev => ({ ...prev, ...updates }));
    }, []);

    const resetData = useCallback(() => {
        setData(initialData);
    }, []);

    return {
        data,
        updateData,
        resetData,
    };
};
