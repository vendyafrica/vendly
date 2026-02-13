"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from "react";
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

const API_BASE = ""; // Force relative for same-origin internal API

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
        // Start false so the personal step isn't blocked on initial render
        isLoading: false,
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
                }));
            }
        } catch (e) {
            console.error("Failed to load onboarding state", e);
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

    // Keep a ref that always points to the latest data so callbacks never read stale closures
    const dataRef = useRef<OnboardingData>(state.data);
    useEffect(() => { dataRef.current = state.data; }, [state.data]);

    const refreshStatus = useCallback(async () => {
        // Local storage source of truth. No API check needed.
        setState(prev => ({ ...prev, isLoading: false }));
    }, []);

    const setPersonalDraft = useCallback((data: Pick<PersonalInfo, "fullName">) => {
        setState(prev => {
            const updatedData = {
                ...prev.data,
                personal: {
                    fullName: data.fullName,
                    phoneNumber: prev.data.personal?.phoneNumber ?? "",
                    countryCode: prev.data.personal?.countryCode ?? "256",
                },
            };
            localStorage.setItem("vendly_onboarding_data", JSON.stringify(updatedData));
            return { ...prev, data: updatedData };
        });
    }, []);

    const savePersonal = useCallback(async (data: PersonalInfo): Promise<boolean> => {
        const nextStep: OnboardingStep = "store";

        setState(prev => {
            const updatedData = { ...prev.data, personal: data };
            // Persist synchronously so data survives page navigation
            localStorage.setItem("vendly_onboarding_data", JSON.stringify(updatedData));
            localStorage.setItem("vendly_onboarding_step", nextStep);
            return { ...prev, data: updatedData, currentStep: nextStep };
        });

        navigateToStep(nextStep);
        return true;
    }, [navigateToStep]);

    const saveStore = useCallback(async (data: StoreInfo): Promise<boolean> => {
        const nextStep: OnboardingStep = "business";

        setState(prev => {
            const updatedData = { ...prev.data, store: data };
            // Persist synchronously so data survives page navigation
            localStorage.setItem("vendly_onboarding_data", JSON.stringify(updatedData));
            localStorage.setItem("vendly_onboarding_step", nextStep);
            return { ...prev, data: updatedData, currentStep: nextStep };
        });

        navigateToStep(nextStep);
        return true;
    }, [navigateToStep]);

    const saveBusiness = useCallback(async (data: BusinessInfo): Promise<boolean> => {
        setState(prev => ({
            ...prev,
            data: { ...prev.data, business: data },
        }));
        // Don't navigate — completeOnboarding handles the API call + navigation
        return true;
    }, []);

    const completeOnboarding = useCallback(async (dataOverride?: Partial<OnboardingData>): Promise<boolean> => {
        try {
            // Extract the absolute latest state.data using setState updater,
            // which always receives the most recent state (no stale closures).
            let latestData: OnboardingData = {};
            setState(prev => {
                latestData = prev.data;
                return { ...prev, isLoading: true, error: null };
            });

            // Also read from localStorage as a fallback for data persisted across page navigations
            let lsData: OnboardingData = {};
            try {
                const saved = localStorage.getItem("vendly_onboarding_data");
                if (saved) lsData = JSON.parse(saved);
            } catch { /* ignore */ }

            // Merge: localStorage (broadest) < react state (latest in-memory) < explicit override
            const payloadData = { ...lsData, ...latestData, ...dataOverride };

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
                // Store tenant and store IDs in localStorage for admin app
                if (typeof window !== "undefined") {
                    localStorage.setItem("vendly_tenant_id", result.tenantId);
                    localStorage.setItem("vendly_tenant_slug", result.tenantSlug);
                    localStorage.setItem("vendly_store_id", result.storeId);
                    localStorage.setItem("vendly_store_slug", result.storeSlug);

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
    }, [navigateToStep]);

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
