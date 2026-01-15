"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface OnboardingData {
    step: number;
    businessInfo: {
        tenantName: string;
        storeName: string;
        slug: string;
        phone: string;
        categories: string[];
        businessTypes: string[];
        location: string;
    };
}

interface OnboardingContextType extends OnboardingData {
    setStep: (step: number) => void;
    updateBusinessInfo: (info: Partial<OnboardingData["businessInfo"]>) => void;
}

const defaultState: OnboardingData = {
    step: 1,
    businessInfo: {
        tenantName: "",
        storeName: "",
        slug: "",
        phone: "",
        categories: [],
        businessTypes: [],
        location: "",
    },
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<OnboardingData>(defaultState);

    const setStep = useCallback((step: number) => setState(prev => ({ ...prev, step })), []);

    const updateBusinessInfo = useCallback((info: Partial<OnboardingData["businessInfo"]>) =>
        setState(prev => ({ ...prev, businessInfo: { ...prev.businessInfo, ...info } })), []);

    return (
        <OnboardingContext.Provider value={{
            ...state,
            setStep,
            updateBusinessInfo,
        }}>
            {children}
        </OnboardingContext.Provider>
    );
}

export function useOnboarding() {
    const context = useContext(OnboardingContext);
    if (!context) {
        throw new Error("useOnboarding must be used within an OnboardingProvider");
    }
    return context;
}
