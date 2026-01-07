'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';

export type OnboardingData = {
  // Personal
  fullName: string;
  phone: string;
  // Business
  categories: string[];
  // Store Setup
  storeName: string;
  subdomain: string;
  colorPalette: string;
  selectedThemeId: string;
  // Job tracking
  jobId?: string;
};

const defaultData: OnboardingData = {
  fullName: '',
  phone: '',
  categories: [],
  storeName: '',
  subdomain: '',
  colorPalette: '',
  selectedThemeId: 'premium-minimal',
};

const STORAGE_KEY = 'vendly_onboarding';

function getStoredData(): OnboardingData {
  if (typeof window === 'undefined') return defaultData;
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultData, ...JSON.parse(stored) };
    }
  } catch {
    // ignore
  }
  return defaultData;
}

type OnboardingContextType = {
  data: OnboardingData;
  updateData: (partial: Partial<OnboardingData>) => void;
  resetData: () => void;
};

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<OnboardingData>(getStoredData);

  // Persist to sessionStorage on change
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore
    }
  }, [data]);

  const updateData = useCallback((partial: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  }, []);

  const resetData = useCallback(() => {
    setData(defaultData);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return (
    <OnboardingContext.Provider value={{ data, updateData, resetData }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return ctx;
}
