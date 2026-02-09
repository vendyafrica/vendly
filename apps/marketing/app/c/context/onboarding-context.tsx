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

export interface SellerIdentity {
  userId: string;
  email: string;
}

interface OnboardingState {
  currentStep: OnboardingStep;
  data: OnboardingData;
  isComplete: boolean;
  isLoading: boolean;
  error: string | null;
  sellerIdentity: SellerIdentity | null;
}

interface OnboardingContextValue extends OnboardingState {
  savePersonal: (data: PersonalInfo) => Promise<boolean>;
  saveStore: (data: StoreInfo) => Promise<boolean>;
  saveBusiness: (data: BusinessInfo) => Promise<boolean>;
  completeOnboarding: (dataOverride?: Partial<OnboardingData>) => Promise<boolean>;
  goBack: () => Promise<void>;
  refreshStatus: () => Promise<void>;
  navigateToStep: (step: OnboardingStep) => void;
  setSellerIdentity: (identity: SellerIdentity) => void;
}

const API_BASE = "";

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
    isLoading: false,
    error: null,
    sellerIdentity: null,
  });

  useEffect(() => {
    try {
      const savedData = localStorage.getItem("vendly_onboarding_data");
      const savedStep = localStorage.getItem("vendly_onboarding_step") as OnboardingStep;
      const savedSeller = localStorage.getItem("vendly_onboarding_seller");

      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setState((prev) => ({
          ...prev,
          data: parsedData,
          currentStep: savedStep || "signup",
          sellerIdentity: savedSeller ? (JSON.parse(savedSeller) as SellerIdentity) : null,
        }));
      }
    } catch (e) {
      console.error("Failed to load onboarding state", e);
    }
  }, []);

  useEffect(() => {
    if (!state.isLoading) {
      localStorage.setItem("vendly_onboarding_data", JSON.stringify(state.data));
      localStorage.setItem("vendly_onboarding_step", state.currentStep);
      if (state.sellerIdentity) {
        localStorage.setItem("vendly_onboarding_seller", JSON.stringify(state.sellerIdentity));
      }
    }
  }, [state.data, state.currentStep, state.isLoading, state.sellerIdentity]);

  const navigateToStep = useCallback(
    (step: OnboardingStep) => {
      const route = STEP_ROUTES[step];
      router.push(route);
    },
    [router]
  );

  const refreshStatus = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: false }));
  }, []);

  const savePersonal = useCallback(
    async (data: PersonalInfo): Promise<boolean> => {
      const updatedData = { ...state.data, personal: data };
      const nextStep: OnboardingStep = "store";

      setState((prev) => ({
        ...prev,
        data: updatedData,
        currentStep: nextStep,
      }));

      navigateToStep(nextStep);
      return true;
    },
    [state.data, navigateToStep, state.sellerIdentity]
  );

  const saveStore = useCallback(
    async (data: StoreInfo): Promise<boolean> => {
      const updatedData = { ...state.data, store: data };
      const nextStep: OnboardingStep = "business";

      setState((prev) => ({
        ...prev,
        data: updatedData,
        currentStep: nextStep,
      }));

      navigateToStep(nextStep);
      return true;
    },
    [state.data, navigateToStep]
  );

  const saveBusiness = useCallback(
    async (data: BusinessInfo): Promise<boolean> => {
      const updatedData = { ...state.data, business: data };
      const nextStep: OnboardingStep = "complete";

      setState((prev) => ({
        ...prev,
        data: updatedData,
        currentStep: nextStep,
      }));

      navigateToStep(nextStep);
      return true;
    },
    [state.data, navigateToStep]
  );

  const setSellerIdentity = useCallback((identity: SellerIdentity) => {
    setState((prev) => ({ ...prev, sellerIdentity: identity }));
  }, []);

  const completeOnboarding = useCallback(
    async (dataOverride?: Partial<OnboardingData>): Promise<boolean> => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        if (!state.sellerIdentity) {
          throw new Error("Missing seller identity");
        }

        const payloadData = { ...state.data, ...dataOverride };

        const result = await apiCall<{
          success: boolean;
          tenantId: string;
          tenantSlug: string;
          storeId: string;
          storeSlug: string;
        }>("/", {
          method: "POST",
          body: JSON.stringify({
            data: payloadData,
            email: state.sellerIdentity.email,
            userId: state.sellerIdentity.userId,
          }),
        });

        if (result.success) {
          if (typeof window !== "undefined") {
            localStorage.setItem("vendly_tenant_id", result.tenantId);
            localStorage.setItem("vendly_tenant_slug", result.tenantSlug);
            localStorage.setItem("vendly_store_id", result.storeId);
            localStorage.setItem("vendly_store_slug", result.storeSlug);

            localStorage.removeItem("vendly_onboarding_data");
            localStorage.removeItem("vendly_onboarding_step");
            localStorage.removeItem("vendly_onboarding_seller");
          }

          setState((prev) => ({
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
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: err instanceof Error ? err.message : "Failed to complete",
        }));
        return false;
      }
    },
    [state.data, navigateToStep]
  );

  const goBack = useCallback(async () => {
    const current = state.currentStep;
    let prev: OnboardingStep = "signup";
    if (current === "personal") prev = "signup";
    else if (current === "store") prev = "personal";
    else if (current === "business") prev = "store";
    else if (current === "complete") prev = "business";

    if (prev === "signup" && current === "signup") {
      return;
    }

    setState((prevStep) => ({ ...prevStep, currentStep: prev }));
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
    setSellerIdentity,
  };

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}
