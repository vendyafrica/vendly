'use client';

import type { ReactNode } from 'react';

import { usePathname, useRouter } from 'next/navigation';

import { Button } from '@/components/button-1';
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperTitle,
  StepperTrigger,
} from '@/components/stepper';
import { ArrowLeft02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

const steps = [
  { title: 'Personal', href: '/sell/personal' },
  { title: 'Business', href: '/sell/business' },
  { title: 'Store Setup', href: '/sell/store-setup' },
  { title: 'Success', href: '/sell/success' },
];

function getCurrentStep(pathname: string) {
  const idx = steps.findIndex((s) => pathname.startsWith(s.href));
  return idx >= 0 ? idx + 1 : 1;
}

export default function SellOnboardingSteps({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const currentStep = getCurrentStep(pathname);

  const goToStep = (step: number) => {
    const next = steps[step - 1];
    if (!next) return;
    router.push(next.href);
  };

  const canGoBack = currentStep > 1;
  const canGoNext = currentStep < steps.length;

  return (
    <div className="w-full">
      <Stepper value={currentStep} onValueChange={goToStep}>
        <StepperNav className="gap-4 mb-6">
          {steps.map((step, index) => (
            <StepperItem key={step.href} step={index + 1} className="relative flex-1 items-start">
              <StepperTrigger className="flex w-full flex-col items-start justify-center gap-2">
                <StepperIndicator className="h-0.5 w-full rounded-full bg-border data-[state=active]:bg-primary data-[state=completed]:bg-primary" />
                <div className="flex flex-col items-start gap-0.5">
                  <StepperTitle className="text-xs font-medium text-muted-foreground data-[state=active]:text-foreground data-[state=completed]:text-foreground">
                    {step.title}
                  </StepperTitle>
                </div>
              </StepperTrigger>
            </StepperItem>
          ))}
        </StepperNav>
      </Stepper>

      <div className="mt-4">{children}</div>

      {currentStep !== steps.length ? (
        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToStep(currentStep - 1)}
            disabled={!canGoBack}
          >
            <HugeiconsIcon icon={ArrowLeft02Icon} />
            Back
          </Button>
        </div>
      ) : null}
    </div>
  );
}
