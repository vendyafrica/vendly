import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { cn } from "@vendly/ui/lib/utils"

type Step = { id: number; label: string }

interface ProgressIndicatorProps {
  steps: Step[]
  currentStep: number
  onStepClick: (index: number) => void
}

export function ProgressIndicator({ steps, currentStep, onStepClick }: ProgressIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center gap-4">
          <button
            onClick={() => onStepClick(index)}
            disabled={index > currentStep}
            className={cn(
              "relative flex h-10 w-10 items-center justify-center rounded-full transition-all",
              index < currentStep && "bg-foreground/10",
              index === currentStep && "bg-foreground text-background shadow-lg",
              index > currentStep && "bg-muted/50 text-muted-foreground/40"
            )}
          >
            {index < currentStep ? (
              <HugeiconsIcon icon={CheckmarkCircle02Icon} className="h-5 w-5" />
            ) : (
              <span className="text-sm font-medium">{step.id}</span>
            )}
            {index === currentStep && (
              <div className="absolute inset-0 rounded-full bg-foreground/20 blur-md animate-pulse" />
            )}
          </button>

          {index < steps.length - 1 && (
            <div className="h-[2px] w-16 bg-muted/40">
              <div
                className="h-full bg-foreground/40 transition-all duration-700 origin-left"
                style={{ transform: index < currentStep ? "scaleX(1)" : "scaleX(0)" }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}