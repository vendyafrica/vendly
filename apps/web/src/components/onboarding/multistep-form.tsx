"use client"

import { useState } from "react"
import { ProgressIndicator } from "./progress-indicator"
import { StepHeader } from "./StepHeader"
import { StepNavigation } from "./StepNavigation"
import { BusinessInfoStep } from "./steps/BusinessInfoStep"
import { PersonalInfoStep } from "./steps/PersonalInfoStep"
import { PaymentSetupStep } from "./steps/PaymentSetupStep"
import { StoreSetupStep } from "./steps/StoreSetupStep"
import { CompletionScreen } from "./CompletionScreen"
import { Card, CardContent } from "@vendly/ui/components/card"

const steps = [
  { id: 1, label: "Business", description: "Tell us about your business" },
  { id: 2, label: "Personal", description: "We need this to set up your account and process payments" },
  { id: 3, label: "Payment", description: "How you want to receive payments from your sales" },
  { id: 4, label: "Store", description: "Choose your location, template, and brand colors" },
]

export function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [isComplete, setIsComplete] = useState(false)

  const updateFormData = (updates: Record<string, string>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  const goNext = () => {
    if (currentStep === steps.length - 1) {
      setIsComplete(true)
    } else {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const goBack = () => setCurrentStep((prev) => Math.max(0, prev - 1))

  const goToStep = (index: number) => {
    if (index < currentStep) setCurrentStep(index)
  }

  const currentStepConfig = steps[currentStep]

  if (isComplete) return <CompletionScreen businessName={formData.businessName || ""} />

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <BusinessInfoStep formData={formData} updateFormData={updateFormData} />
      case 1: return <PersonalInfoStep formData={formData} updateFormData={updateFormData} />
      case 2: return <PaymentSetupStep formData={formData} updateFormData={updateFormData} />
      case 3: return <StoreSetupStep formData={formData} updateFormData={updateFormData} />
      default: return null
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <ProgressIndicator
        steps={steps}
        currentStep={currentStep}
        onStepClick={goToStep}
      />

      <Card className="mt-8">
        <StepHeader
          title={`${currentStepConfig.label} Information`}
          description={currentStepConfig.description}
          stepNumber={currentStep + 1}
          totalSteps={steps.length}
        />

        <CardContent className="pt-6">
          <div className="min-h-[400px]">{renderStep()}</div>

          <StepNavigation
            currentStep={currentStep}
            totalSteps={steps.length}
            onBack={goBack}
            onNext={goNext}
            isNextDisabled={!isStepValid(currentStep, formData)}
          />
        </CardContent>
      </Card>
    </div>
  )
}

// Simple validation (you can replace with zod later)
function isStepValid(step: number, data: Record<string, string>): boolean {
  switch (step) {
    case 0:
      return !!(data.businessName && data.category && data.businessType)
    case 1:
      return !!(data.name && data.phone && data.email)
    case 2:
      if (!data.currency || !data.paymentMethod) return false
      if (data.paymentMethod === "bank")
        return !!(data.bankName && data.accountNumber && data.routingNumber)
      if (data.paymentMethod === "card")
        return !!(data.cardNumber && data.expiryDate && data.cvv)
      return false
    case 3:
      return !!(data.location && data.template && data.palette)
    default:
      return false
  }
}