// app/create-store/(components)/step-context.tsx
"use client";

import { createContext, useContext, useState, useRef, ReactNode, useEffect } from "react";

interface StepContextType {
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
  registerStepRef: (step: number, ref: HTMLDivElement | null) => void;
}

const StepContext = createContext<StepContextType | null>(null);

export function StepProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1);
  const stepRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const isBrowserNavigating = useRef(false);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.step) {
        isBrowserNavigating.current = true;
        setCurrentStep(event.state.step);
      }
    };

    window.addEventListener('popstate', handlePopState);

    // Initialize history state on first load
    if (!window.history.state) {
      window.history.replaceState({ step: 1 }, '', window.location.pathname);
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Update browser history when step changes (but not during browser navigation)
  useEffect(() => {
    if (!isBrowserNavigating.current) {
      window.history.pushState({ step: currentStep }, '', window.location.pathname);
    }
    isBrowserNavigating.current = false;
  }, [currentStep]);

  const goToStep = (step: number) => {
    setCurrentStep(step);
    setTimeout(() => {
      stepRefs.current[step]?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
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
    stepRefs.current[step] = ref;
  };

  return (
    <StepContext.Provider value={{ currentStep, nextStep, prevStep, registerStepRef }}>
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