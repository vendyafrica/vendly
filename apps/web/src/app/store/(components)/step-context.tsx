// app/create-store/(components)/step-context.tsx
"use client";

import { createContext, useContext, useState, useRef, ReactNode, useEffect } from "react";

// ... (FormData interface remains the same) ...
interface FormData {
  fullName?: string;
  phoneNumber?: string;
  password?: string;
  storeName?: string;
  slug?: string;
  paymentMethod?: 'till' | 'phone' | 'bank';
  mpesaTillNumber?: string;
  mpesaPhoneNumber?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankName?: string;
  pickupCounty?: string;
  pickupBuilding?: string;
  pickupMoreDetails?: string;
  deliveryMethod?: 'vendly' | 'self';
}


interface StepContextType {
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void; // <-- ADD THIS
  registerStepRef: (step: number, ref: HTMLDivElement | null) => void;
  formData: FormData;
  setFormData: (data: Partial<FormData>) => void;
}

const StepContext = createContext<StepContextType | null>(null);

const STEP_STORAGE_KEY = 'create-store-step';
const DATA_STORAGE_KEY = 'create-store-data';

export function StepProvider({ children }: { children: ReactNode }) {

  // --- UPDATED (1/4) ---
  // Initialize state with defaults. Server and client will NOW match on first render.
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormDataState] = useState<FormData>({});

  // This state tracks if we have successfully loaded (hydrated) from session storage
  const [isHydrated, setIsHydrated] = useState(false);

  // --- (Existing code) ---
  const stepRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const isBrowserNavigating = useRef(false);

  // --- NEW useEffect (2/4) ---
  // This effect runs ONCE on the client after hydration.
  useEffect(() => {
    // Check if we are on the client side
    if (typeof window !== 'undefined') {
      try {
        const storedStep = window.sessionStorage.getItem(STEP_STORAGE_KEY);
        const storedData = window.sessionStorage.getItem(DATA_STORAGE_KEY);
        
        if (storedStep) {
          setCurrentStep(JSON.parse(storedStep) as number);
        }
        if (storedData) {
          setFormDataState(JSON.parse(storedData) as FormData);
        }
      } catch (e) {
        console.error("Failed to parse stored state:", e);
      }
      // Mark hydration as complete
      setIsHydrated(true);
    }
  }, []); // Empty dependency array means this runs once on mount.

  
  // Handle browser back/forward navigation
  useEffect(() => {
    if (!isHydrated) return; // Don't run this logic until hydrated

    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.step) {
        isBrowserNavigating.current = true;
        setCurrentStep(event.state.step);
      }
    };
    window.addEventListener('popstate', handlePopState);
    if (!window.history.state) {
      window.history.replaceState({ step: currentStep }, '', window.location.pathname);
    }
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isHydrated, currentStep]); // Added isHydrated and currentStep

  // Update browser history
  useEffect(() => {
    if (!isHydrated) return; // Don't run this logic until hydrated
    
    if (!isBrowserNavigating.current) {
      window.history.pushState({ step: currentStep }, '', window.location.pathname);
    }
    isBrowserNavigating.current = false;
  }, [currentStep, isHydrated]); // Added isHydrated

  // --- UPDATED useEffect (3/4) ---
  // This effect saves state to session storage, but only *after* hydration.
  useEffect(() => {
    // Only save to session storage if we are hydrated
    if (isHydrated && typeof window !== 'undefined') {
      try {
        window.sessionStorage.setItem(STEP_STORAGE_KEY, JSON.stringify(currentStep));
        window.sessionStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(formData));
      } catch (e) {
        console.error("Failed to save state to sessionStorage:", e);
      }
    }
  }, [currentStep, formData, isHydrated]); // Depends on all three


  const goToStep = (step: number) => {
    // Allow navigation to any step
    if (step >= 1 && step <= 4) { // Assuming 4 steps max
      setCurrentStep(step);
      setTimeout(() => {
        // Find the ref. Note: stepRefs.current[step] might not be right
        // if index is 0-based. Let's assume step is 1-based.
        stepRefs.current[step]?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) { // Assuming max 4 steps
      goToStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  };

  const registerStepRef = (step: number, ref: HTMLDivElement | null) => {
    // This is for the scroll-into-view. We pass the step number (1-4).
    // The ref array is 0-indexed. This might be a bug.
    // Let's assume the stepper components are passing the correct step number.
    stepRefs.current[step] = ref;
  };

  const setFormData = (data: Partial<FormData>) => {
    setFormDataState((prevData) => ({
      ...prevData,
      ...data,
    }));
  };

  // --- UPDATED (4/4) ---
  const value = {
    currentStep,
    nextStep,
    prevStep,
    goToStep, // <-- ADD goToStep to the context value
    registerStepRef,
    formData,
    setFormData,
  };

  return (
    <StepContext.Provider value={value}>
      {children}
    </StepContext.Provider>
  );
}

export function useSteps() {
  const context = useContext(StepContext);
  if (!context) {
    throw new Error("useSteps must be used within StepProvider");
  }
  return context;
}