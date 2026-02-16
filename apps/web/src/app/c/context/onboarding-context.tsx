"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useRouter } from "next/navigation";

export type OnboardingStep = "signup" | "personal" | "store" | "business" | "complete";

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
    setPersonalDraft: (data: Pick<PersonalInfo, "fullName">) => void;
    savePersonal: (data: PersonalInfo) => Promise<boolean>;
    saveStore: (data: StoreInfo) => Promise<boolean>;
    saveBusiness: (data: BusinessInfo) => Promise<boolean>;
    completeOnboarding: (dataOverride?: Partial<OnboardingData>) => Promise<boolean>;
    goBack: () => Promise<void>;
    refreshStatus: () => Promise<void>;
    navigateToStep: (step: OnboardingStep) => void;
}

const LS_DATA_KEY = "vendly_onboarding_data";
const LS_STEP_KEY = "vendly_onboarding_step";

// ── localStorage helpers (called synchronously — no races) ──────────────────

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
        return (localStorage.getItem(LS_STEP_KEY) as OnboardingStep) || "signup";
    } catch {
        return "signup";
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

// ── API helper ──────────────────────────────────────────────────────────────

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

// ── Context ─────────────────────────────────────────────────────────────────

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

    // ── Synchronous init from localStorage — eliminates the useEffect race ──
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

    // Persist to localStorage whenever data or step changes.
    // Because initial state already matches localStorage, the first write is a harmless no-op.
    useEffect(() => {
        if (!state.isLoading) {
            writeLS(state.data, state.currentStep);
        }
    }, [state.data, state.currentStep, state.isLoading]);

    const navigateToStep = useCallback((step: OnboardingStep) => {
        router.push(STEP_ROUTES[step]);
    }, [router]);

    const refreshStatus = useCallback(async () => {
        setState(prev => ({ ...prev, isLoading: false }));
    }, []);

    const setPersonalDraft = useCallback((draft: Pick<PersonalInfo, "fullName">) => {
        setState(prev => {
            const updatedData: OnboardingData = {
                ...prev.data,
                personal: {
                    fullName: draft.fullName,
                    phoneNumber: prev.data.personal?.phoneNumber ?? "",
                    countryCode: prev.data.personal?.countryCode ?? "256",
                },
            };
            writeLS(updatedData);
            return { ...prev, data: updatedData };
        });
    }, []);

    const savePersonal = useCallback(async (info: PersonalInfo): Promise<boolean> => {
        const nextStep: OnboardingStep = "store";
        setState(prev => {
            const updatedData = { ...prev.data, personal: info };
            writeLS(updatedData, nextStep);
            return { ...prev, data: updatedData, currentStep: nextStep };
        });
        navigateToStep(nextStep);
        return true;
    }, [navigateToStep]);

    const saveStore = useCallback(async (info: StoreInfo): Promise<boolean> => {
        const nextStep: OnboardingStep = "business";
        setState(prev => {
            const updatedData = { ...prev.data, store: info };
            writeLS(updatedData, nextStep);
            return { ...prev, data: updatedData, currentStep: nextStep };
        });
        navigateToStep(nextStep);
        return true;
    }, [navigateToStep]);

    const saveBusiness = useCallback(async (info: BusinessInfo): Promise<boolean> => {
        setState(prev => {
            const updatedData = { ...prev.data, business: info };
            // Also persist business data to localStorage so completeOnboarding can read it
            writeLS(updatedData, "business");
            return { ...prev, data: updatedData };
        });
        return true;
    }, []);

    const completeOnboarding = useCallback(async (dataOverride?: Partial<OnboardingData>): Promise<boolean> => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));

            // Single source of truth: read everything from localStorage
            // (every save* function writes there synchronously inside setState)
            const persisted = readLS();

            // Merge persisted data with any explicit override (e.g. business categories)
            const payloadData: OnboardingData = { ...persisted, ...dataOverride };

            console.log("[completeOnboarding] payload:", JSON.stringify(payloadData));

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
        const current = state.currentStep;
        let prev: OnboardingStep = "signup";
        if (current === "personal") prev = "signup";
        else if (current === "store") prev = "personal";
        else if (current === "business") prev = "store";
        else if (current === "complete") prev = "business";

        if (prev === "signup" && current === "signup") return;

        setState(s => ({ ...s, currentStep: prev }));
        navigateToStep(prev);
    }, [state.currentStep, navigateToStep]);

    const value: OnboardingContextValue = {
        ...state,
        setPersonalDraft,
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

