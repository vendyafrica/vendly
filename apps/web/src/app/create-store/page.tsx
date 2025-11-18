// app/create-store/page.tsx
"use client";

import { useSteps } from "./(components)/step-context";
import { PersonalDetailsForm } from "./(components)/personal-details";
import { CreateStoreForm } from "./(components)/create-store";
import { PaymentSetupForm } from "./(components)/payment-setup";
import { DeliveryDetails } from "./(components)/delivery-details";

export default function CreateStorePage() {
  const { currentStep, nextStep, prevStep } = useSteps();

  // Render ONLY the current step - no hidden elements
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalDetailsForm onNext={nextStep} currentStep={currentStep} />;
      case 2:
        return <CreateStoreForm onNext={nextStep} onPrev={prevStep} currentStep={currentStep} />;
      case 3:
        return <PaymentSetupForm onNext={nextStep} onBack={prevStep} />;
      case 4:
        return <DeliveryDetails onBack={prevStep} />;
      default:
        return <PersonalDetailsForm onNext={nextStep} />;
    }
  };

  return (
    <div className="w-full">
      {renderStep()}
    </div>
  );
}