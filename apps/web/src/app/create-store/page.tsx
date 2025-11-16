// app/create-store/page.tsx
"use client";

import { PersonalDetailsForm } from "./(components)/personal-details";
import { CreateStoreForm } from "./(components)/create-store";
import { PaymentSetupForm } from "./(components)/payment-setup";
import { DeliveryDetails } from "./(components)/delivery-details";
import { useSteps } from "./(components)/step-context";

export default function CreateStorePage() {
  const { currentStep, nextStep, prevStep, registerStepRef } = useSteps();

  return (
    <div className="space-y-12">
      {/* Step 1: Personal Details */}
      <div ref={(ref) => registerStepRef(1, ref)}>
        {currentStep === 1 && <PersonalDetailsForm onNext={nextStep} />}
      </div>

      {/* Step 2: Store Info */}
      <div ref={(ref) => registerStepRef(2, ref)}>
        {currentStep === 2 && (
          <CreateStoreForm onNext={nextStep} onPrev={prevStep} />
        )}
      </div>

      {/* Step 3: Payment Setup */}
      <div ref={(ref) => registerStepRef(3, ref)}>
        {currentStep === 3 && (
          <PaymentSetupForm onBack={prevStep} />
        )}
      </div>

      {/* Step 4: Delivery Setup */}
      <div ref={(ref) => registerStepRef(4, ref)}>
        {currentStep === 4 && (
          <DeliveryDetails onBack={prevStep} />
        )}
      </div>
    </div>
  );
}