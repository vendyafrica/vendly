import { Button } from "@vendly/ui/components/button"
import { ArrowLeftIcon, ArrowRightIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

interface StepNavigationProps {
  currentStep: number
  totalSteps: number
  onBack: () => void
  onNext: () => void
  isNextDisabled: boolean
}

export function StepNavigation({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  isNextDisabled,
}: StepNavigationProps) {
  return (
    <div className="mt-8 flex gap-4">
      {currentStep > 0 && (
        <Button variant="outline" onClick={onBack} className="flex-1">
          <HugeiconsIcon icon={ArrowLeftIcon} className="mr-2 h-4 w-4" />
          Back
        </Button>
      )}
      <Button
        onClick={onNext}
        disabled={isNextDisabled}
        className={cn("flex-1", currentStep === 0 && "ml-auto")}
      >
        {currentStep === totalSteps - 1 ? "Complete Setup" : "Continue"}
        <HugeiconsIcon icon={ArrowRightIcon} className="ml-2 h-4 w-4" />
      </Button>
    </div>
  )
}