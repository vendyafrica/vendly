"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useRouter } from "next/navigation";

export type OnboardingStep = "step1" | "step2" | "complete";

export interface PersonalInfo {
    fullName: string;
    phoneNumber: string;
    countryCode: string;
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
    saveDraft: (info: PersonalInfo & StoreInfo) => void;
    completeOnboarding: (dataOverride?: Partial<OnboardingData>) => Promise<boolean>;
    goBack: () => void;
    navigateToStep: (step: OnboardingStep) => void;
}

const LS_DATA_KEY = "vendly_onboarding_data";
const LS_STEP_KEY = "vendly_onboarding_step";

function readLS(): OnboardingData {
    try {
        const raw = localStorage.getItem(LS_DATA_KEY);
        return raw ? (JSON.parse(raw) as OnboardingData) : {};
    } catch {
        return {};
    }
}

function readLSStep(): OnboardingStep {
    try {
        return (localStorage.getItem(LS_STEP_KEY) as OnboardingStep) || "step1";
    } catch {
        return "step1";
    }
}

function writeLS(data: OnboardingData, step?: OnboardingStep) {
    localStorage.setItem(LS_DATA_KEY, JSON.stringify(data));
    if (step) localStorage.setItem(LS_STEP_KEY, step);
}

function clearLS() {
    localStorage.removeItem(LS_DATA_KEY);
    localStorage.removeItem(LS_STEP_KEY);
}

async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`/api/onboarding${endpoint}`, {
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
    step1: "/c",
    step2: "/c/business",
    complete: "/c/complete",
};

interface ProviderProps {
    children: ReactNode;
}

export function OnboardingProvider({ children }: ProviderProps) {
    const router = useRouter();

    const [state, setState] = useState<OnboardingState>(() => {
        const data = readLS();
        const currentStep = readLSStep();
        return {
            currentStep,
            data,
            isComplete: false,
            isLoading: false,
            error: null,
        };
    });

    useEffect(() => {
        if (!state.isLoading) {
            writeLS(state.data, state.currentStep);
        }
    }, [state.data, state.currentStep, state.isLoading]);

    const navigateToStep = useCallback((step: OnboardingStep) => {
        setState(prev => ({ ...prev, currentStep: step }));
        router.push(STEP_ROUTES[step]);
    }, [router]);

    /**
     * Save personal + store info to localStorage before triggering Google OAuth.
     * This data is retrieved after the OAuth redirect completes.
     */
    const saveDraft = useCallback((info: PersonalInfo & StoreInfo) => {
        const { fullName, phoneNumber, countryCode, storeName, storeDescription, storeLocation } = info;
        setState(prev => {
            const updatedData: OnboardingData = {
                ...prev.data,
                personal: { fullName, phoneNumber, countryCode },
                store: { storeName, storeDescription, storeLocation },
            };
            writeLS(updatedData, "step1");
            return { ...prev, data: updatedData };
        });
    }, []);

    const completeOnboarding = useCallback(async (dataOverride?: Partial<OnboardingData>): Promise<boolean> => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));

            const persisted = readLS();
            const payloadData: OnboardingData = { ...persisted, ...dataOverride };

            const result = await apiCall<{
                success: boolean;
                tenantId: string;
                tenantSlug: string;
                storeId: string;
                storeSlug: string;
            }>("/", {
                method: "POST",
                body: JSON.stringify({ data: payloadData }),
            });

            if (result.success) {
                localStorage.setItem("vendly_tenant_id", result.tenantId);
                localStorage.setItem("vendly_tenant_slug", result.tenantSlug);
                localStorage.setItem("vendly_store_id", result.storeId);
                localStorage.setItem("vendly_store_slug", result.storeSlug);

                clearLS();

                setState(prev => ({
                    ...prev,
                    currentStep: "complete",
                    isComplete: true,
                    isLoading: false,
                    data: {},
                }));

                router.push(STEP_ROUTES["complete"]);
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
    }, [router]);

    const goBack = useCallback(() => {
        navigateToStep("step1");
    }, [navigateToStep]);

    const value: OnboardingContextValue = {
        ...state,
        saveDraft,
        completeOnboarding,
        goBack,
        navigateToStep,
    };

    return (
        <OnboardingContext.Provider value={value}>
            {children}
        </OnboardingContext.Provider>
    );
}
