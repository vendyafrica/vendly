"use client";

import { useOnboarding } from "./context/onboarding-context";
import { Step0Pricing } from "./components/step0-pricing";
import { Step1Info } from "./components/step1-info";
import { Step2Categories } from "./components/step2-categories";

export default function OnboardingRoute() {
  const { currentStep } = useOnboarding();

  if (currentStep === "step2") return <Step2Categories />;
  if (currentStep === "step1") return <Step1Info />;
  return <Step0Pricing />;
}