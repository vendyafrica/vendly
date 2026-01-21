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
    signup: "/onboarding",
    personal: "/onboarding/personal",
    store: "/onboarding/store",
    business: "/onboarding/business",
    complete: "/onboarding/complete",
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

    const refreshStatus = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));

            const status = await apiCall<{
                currentStep: OnboardingStep;
                data: OnboardingData;
                isComplete: boolean;
            }>("/status");

            setState({
                currentStep: status.currentStep,
                data: status.data,
                isComplete: status.isComplete,
                isLoading: false,
                error: null,
            });
        } catch (err) {
            // If not authenticated, stay on signup
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: null, // Don't show error for unauthenticated users
            }));
        }
    }, []);

    useEffect(() => {
        refreshStatus();
    }, [refreshStatus]);

    const navigateToStep = useCallback((step: OnboardingStep) => {
        const route = STEP_ROUTES[step];
        router.push(route);
    }, [router]);

    const savePersonal = useCallback(async (data: PersonalInfo): Promise<boolean> => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));

            const result = await apiCall<{ success: boolean; nextStep: OnboardingStep }>("/personal", {
                method: "POST",
                body: JSON.stringify(data),
            });

            if (result.success) {
                setState(prev => ({
                    ...prev,
                    currentStep: result.nextStep,
                    data: { ...prev.data, personal: data },
                    isLoading: false,
                }));
                navigateToStep(result.nextStep);
                return true;
            }
            return false;
        } catch (err) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: err instanceof Error ? err.message : "Failed to save",
            }));
            return false;
        }
    }, [navigateToStep]);

    const saveStore = useCallback(async (data: StoreInfo): Promise<boolean> => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));

            const result = await apiCall<{ success: boolean; nextStep: OnboardingStep }>("/store", {
                method: "POST",
                body: JSON.stringify(data),
            });

            if (result.success) {
                setState(prev => ({
                    ...prev,
                    currentStep: result.nextStep,
                    data: { ...prev.data, store: data },
                    isLoading: false,
                }));
                navigateToStep(result.nextStep);
                return true;
            }
            return false;
        } catch (err) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: err instanceof Error ? err.message : "Failed to save",
            }));
            return false;
        }
    }, [navigateToStep]);

    const saveBusiness = useCallback(async (data: BusinessInfo): Promise<boolean> => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));

            const result = await apiCall<{ success: boolean; nextStep: OnboardingStep }>("/business", {
                method: "POST",
                body: JSON.stringify(data),
            });

            if (result.success) {
                setState(prev => ({
                    ...prev,
                    currentStep: result.nextStep,
                    data: { ...prev.data, business: data },
                    isLoading: false,
                }));
                return true;
            }
            return false;
        } catch (err) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: err instanceof Error ? err.message : "Failed to save",
            }));
            return false;
        }
    }, []);

    const completeOnboarding = useCallback(async (): Promise<boolean> => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));

            const result = await apiCall<{
                success: boolean;
                tenantId: string;
                storeId: string;
                storeSlug: string;
            }>("/complete", { method: "POST" });

            if (result.success) {
                // Store tenant and store IDs in localStorage for admin app
                if (typeof window !== "undefined") {
                    localStorage.setItem("vendly_tenant_id", result.tenantId);
                    localStorage.setItem("vendly_store_id", result.storeId);
                }

                setState(prev => ({
                    ...prev,
                    currentStep: "complete",
                    isComplete: true,
                    isLoading: false,
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
    }, [navigateToStep]);

    const goBack = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));

            const result = await apiCall<{ success: boolean; nextStep: OnboardingStep }>("/back", {
                method: "POST",
            });

            if (result.success) {
                setState(prev => ({
                    ...prev,
                    currentStep: result.nextStep,
                    isLoading: false,
                }));
                navigateToStep(result.nextStep);
            }
        } catch (err) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: err instanceof Error ? err.message : "Failed to go back",
            }));
        }
    }, [navigateToStep]);

    const value: OnboardingContextValue = {
        ...state,
        savePersonal,
        saveStore,
        saveBusiness,
        completeOnboarding,
        goBack,
        refreshStatus,
    };

    return (
        <OnboardingContext.Provider value={value}>
            {children}
        </OnboardingContext.Provider>
    );
}
