"use client";

import { Checkbox } from "@vendly/ui/components/checkbox";
import { cn } from "@vendly/ui/lib/utils";
import { useOnboarding } from "../context/onboarding-context";

export type Category = {
  id: string;
  label: string;
};

const STEP_LABELS: Record<import("../context/onboarding-context").OnboardingStep, string> = {
  step1: "Business",
  step2: "Categories",
  complete: "Complete",
};

export function StepIndicator() {
  const { currentStep } = useOnboarding();

  const steps: import("../context/onboarding-context").OnboardingStep[] = ["step1", "step2", "complete"];

  const currentIndex = steps.indexOf(currentStep);

  return (
    <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground">
      {steps.map((step, idx) => {
        const isActive = idx === currentIndex;
        const isComplete = idx < currentIndex;
        return (
          <div key={step} className="flex items-center gap-2">
            <div
              className={cn(
                "h-2.5 w-2.5 rounded-full border",
                isActive || isComplete ? "bg-primary border-primary" : "bg-muted border-border"
              )}
            />
            <span className={cn(isActive ? "text-foreground" : "")}>{STEP_LABELS[step]}</span>
            {idx < steps.length - 1 && <div className="h-px w-6 bg-border" />}
          </div>
        );
      })}
    </div>
  );
}

interface CategoriesSelectorProps {
  availableCategories: Category[];
  selectedCategories: string[];
  onChange: (categories: string[]) => void;
  maxSelections?: number;
}

export function CategoriesSelector({
  availableCategories,
  selectedCategories,
  onChange,
  maxSelections = 5,
}: CategoriesSelectorProps) {
  const toggle = (id: string) => {
    if (selectedCategories.includes(id)) {
      onChange(selectedCategories.filter((c) => c !== id));
    } else {
      if (selectedCategories.length >= maxSelections) return;
      onChange([...selectedCategories, id]);
    }
  };

  const atMax = selectedCategories.length >= maxSelections;

  return (
    <div className="space-y-3">
      {/* Count hint */}
      <p className="text-xs text-muted-foreground">
        {selectedCategories.length === 0
          ? `Choose up to ${maxSelections}`
          : `${selectedCategories.length} of ${maxSelections} selected`}
      </p>

      {/* Checkbox grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {availableCategories.map((cat) => {
          const checked = selectedCategories.includes(cat.id);
          const disabled = !checked && atMax;

          return (
            <label
              key={cat.id}
              htmlFor={`cat-${cat.id}`}
              className={cn(
                "flex items-center gap-2.5 rounded-md border px-3 py-2.5 cursor-pointer transition-colors select-none",
                checked
                  ? "border-primary bg-primary/5"
                  : disabled
                  ? "border-border bg-muted/30 opacity-50 cursor-not-allowed"
                  : "border-border bg-background hover:border-primary/40 hover:bg-muted/30"
              )}
            >
              <Checkbox
                id={`cat-${cat.id}`}
                checked={checked}
                onCheckedChange={() => toggle(cat.id)}
                disabled={disabled}
                className="shrink-0"
              />
              <span
                className={cn(
                  "text-sm font-medium leading-tight",
                  checked ? "text-primary" : "text-foreground"
                )}
              >
                {cat.label}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}