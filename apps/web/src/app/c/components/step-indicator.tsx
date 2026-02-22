"use client";

import { Check } from "lucide-react";
import { usePathname } from "next/navigation";

const STEPS = [
  { label: "Your Info", paths: ["/c"] },
  { label: "Categories", paths: ["/c/business"] },
  { label: "Done", paths: ["/c/complete"] },
];

export function StepIndicator() {
  const pathname = usePathname();

  const currentIndex = STEPS.findIndex((s) =>
    s.paths.some((p) => pathname === p || pathname.startsWith(p + "?"))
  );

  if (currentIndex === -1) return null;

  return (
    <nav aria-label="Onboarding progress" className="flex items-center gap-1">
      {STEPS.map((step, index) => {
        const isComplete = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={step.label} className="flex items-center gap-1">
            {/* Step bubble + label */}
            <div className="flex items-center gap-1.5">
              {/* Bubble */}
              <div
                aria-current={isCurrent ? "step" : undefined}
                className={[
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-medium transition-all duration-300",
                  isComplete
                    ? "border-primary bg-primary text-primary-foreground"
                    : isCurrent
                    ? "border-primary bg-background text-primary"
                    : "border-border bg-background text-muted-foreground",
                ].join(" ")}
              >
                {isComplete ? (
                  <Check className="h-3 w-3 stroke-[2.5]" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>

              {/* Label — visible on md+ */}
              <span
                className={[
                  "hidden md:block text-xs font-medium transition-colors duration-200",
                  isCurrent
                    ? "text-foreground"
                    : isComplete
                    ? "text-muted-foreground"
                    : "text-muted-foreground/50",
                ].join(" ")}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line — not after last step */}
            {index < STEPS.length - 1 && (
              <div
                className={[
                  "mx-1 h-px w-6 rounded-full transition-all duration-300",
                  isComplete ? "bg-primary/50" : "bg-border",
                ].join(" ")}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}