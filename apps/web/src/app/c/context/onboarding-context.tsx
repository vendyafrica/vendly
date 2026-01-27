"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useRouter } from "next/navigation";

export type OnboardingStep = "signup" | "personal" | "store" | "business" | "complete";

export interface PersonalInfo {
    fullName: string;
    phoneNumber: string;
}

export interface StoreInfo {
    storeName: string;
    storeDescription: string;
    storeLocation: string;
}

export interface BusinessInfo {
    categories: string[];
}

export interface OnboardingData {
    personal?: PersonalInfo;
    store?: StoreInfo;
    business?: BusinessInfo;
}

interface OnboardingState {
    currentStep: OnboardingStep;
    data: OnboardingData;
    isComplete: boolean;
    isLoading: boolean;
    error: string | null;
}

interface OnboardingContextValue extends OnboardingState {
    savePersonal: (data: PersonalInfo) => Promise<boolean>;
    saveStore: (data: StoreInfo) => Promise<boolean>;
    saveBusiness: (data: BusinessInfo) => Promise<boolean>;
    completeOnboarding: () => Promise<boolean>;
    goBack: () => Promise<void>;
    refreshStatus: () => Promise<void>;
    navigateToStep: (step: OnboardingStep) => void;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE}/api/onboarding${endpoint}`, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || data.message || "API request failed");
    }

    return data;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function useOnboarding() {
    const context = useContext(OnboardingContext);
    if (!context) {
        throw new Error("useOnboarding must be used within OnboardingProvider");
    }
    return context;
}

const STEP_ROUTES: Record<OnboardingStep, string> = {
    signup: "/c",
    personal: "/c/personal",
    store: "/c/store",
    business: "/c/business",
    complete: "/c/complete",
};

interface ProviderProps {
    children: ReactNode;
}

export function OnboardingProvider({ children }: ProviderProps) {
    const router = useRouter();

    const [state, setState] = useState<OnboardingState>({
        currentStep: "signup",
        data: {},
        isComplete: false,
        isLoading: true,
        error: null,
    });

    // Load state from localStorage on mount
    useEffect(() => {
        try {
            const savedData = localStorage.getItem("vendly_onboarding_data");
            const savedStep = localStorage.getItem("vendly_onboarding_step") as OnboardingStep;

            if (savedData) {
                const parsedData = JSON.parse(savedData);
                setState(prev => ({
                    ...prev,
                    data: parsedData,
                    currentStep: savedStep || "signup",
                    isLoading: false,
                }));
            } else {
                setState(prev => ({ ...prev, isLoading: false }));
            }
        } catch (e) {
            console.error("Failed to load onboarding state", e);
            setState(prev => ({ ...prev, isLoading: false }));
        }
    }, []);

    // Persist to localStorage whenever data or step changes
    useEffect(() => {
        if (!state.isLoading) {
            localStorage.setItem("vendly_onboarding_data", JSON.stringify(state.data));
            localStorage.setItem("vendly_onboarding_step", state.currentStep);
        }
    }, [state.data, state.currentStep, state.isLoading]);

    const navigateToStep = useCallback((step: OnboardingStep) => {
        const route = STEP_ROUTES[step];
        router.push(route);
    }, [router]);

    const refreshStatus = useCallback(async () => {
        // Local storage source of truth. No API check needed.
        setState(prev => ({ ...prev, isLoading: false }));
    }, []);

    const savePersonal = useCallback(async (data: PersonalInfo): Promise<boolean> => {
        const updatedData = { ...state.data, personal: data };
        const nextStep: OnboardingStep = "store";

        setState(prev => ({
            ...prev,
            data: updatedData,
            currentStep: nextStep,
        }));

        navigateToStep(nextStep);
        return true;
    }, [state.data, navigateToStep]);

    const saveStore = useCallback(async (data: StoreInfo): Promise<boolean> => {
        const updatedData = { ...state.data, store: data };
        const nextStep: OnboardingStep = "business";

        setState(prev => ({
            ...prev,
            data: updatedData,
            currentStep: nextStep,
        }));

        navigateToStep(nextStep);
        return true;
    }, [state.data, navigateToStep]);

    const saveBusiness = useCallback(async (data: BusinessInfo): Promise<boolean> => {
        const updatedData = { ...state.data, business: data };
        // Determine next step
        const nextStep: OnboardingStep = "complete";

        setState(prev => ({
            ...prev,
            data: updatedData,
            currentStep: nextStep
        }));

        navigateToStep(nextStep);
        return true;
    }, [state.data, navigateToStep]);

    const completeOnboarding = useCallback(async (): Promise<boolean> => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));

            const result = await apiCall<{
                success: boolean;
                tenantId: string;
                storeId: string;
                storeSlug: string;
            }>("/", {
                method: "POST",
                body: JSON.stringify({ data: state.data }),
            });

            if (result.success) {
                // Store tenant and store IDs in localStorage for admin app
                if (typeof window !== "undefined") {
                    localStorage.setItem("vendly_tenant_id", result.tenantId);
                    localStorage.setItem("vendly_store_id", result.storeId);

                    // Clear onboarding temp data
                    localStorage.removeItem("vendly_onboarding_data");
                    localStorage.removeItem("vendly_onboarding_step");
                }

                setState(prev => ({
                    ...prev,
                    currentStep: "complete",
                    isComplete: true,
                    isLoading: false,
                    data: {}, // clear data in memory too
                }));

                navigateToStep("complete");
                return true;
            }
            return false;
        } catch (err) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: err instanceof Error ? err.message : "Failed to complete",
            }));
            return false;
        }
    }, [state.data, navigateToStep]);

    const goBack = useCallback(async () => {
        // Determine previous step based on current step
        const current = state.currentStep;
        let prev: OnboardingStep = "signup";
        if (current === "personal") prev = "signup";
        else if (current === "store") prev = "personal";
        else if (current === "business") prev = "store";
        else if (current === "complete") prev = "business";

        if (prev === "signup" && current === "signup") {
            // do nothing or router.back()
            return;
        }

        setState(prevStep => ({ ...prevStep, currentStep: prev }));
        navigateToStep(prev);
    }, [state.currentStep, navigateToStep]);

    const value: OnboardingContextValue = {
        ...state,
        savePersonal,
        saveStore,
        saveBusiness,
        completeOnboarding,
        goBack,
        refreshStatus,
        navigateToStep,
    };

    return (
        <OnboardingContext.Provider value={value}>
            {children}
        </OnboardingContext.Provider>
    );
}
