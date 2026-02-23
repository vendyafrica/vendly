"use client";

import { useOnboarding } from "./context/onboarding-context";
import { Step1Info } from "./components/step1-info";
import { Step2Categories } from "./components/step2-categories";

export default function OnboardingRoute() {
  const { currentStep } = useOnboarding();

  if (currentStep === "step2") return <Step2Categories />;
  return <Step1Info />;
}