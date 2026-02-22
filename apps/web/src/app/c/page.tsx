"use client";

import { useOnboarding } from "./context/onboarding-context";
import { Step1Info } from "./components/step1-info";
import { Step2Categories } from "./components/step2-categories";

export default function OnboardingRoute() {
  const { currentStep } = useOnboarding();
  return currentStep === "step2" ? <Step2Categories /> : <Step1Info />;
}