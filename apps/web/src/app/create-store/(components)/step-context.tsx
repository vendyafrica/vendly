// app/create-store/(components)/step-context.tsx
"use client";

import { createContext, useContext, useState, useRef, ReactNode } from "react";

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

  const goToStep = (step: number) => {
    setCurrentStep(step);
    setTimeout(() => {
      stepRefs.current[step]?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const nextStep = () => {
    goToStep(currentStep + 1);
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