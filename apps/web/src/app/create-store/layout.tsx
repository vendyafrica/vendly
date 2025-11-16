// app/create-store/layout.tsx
"use client";

import { ReactNode } from "react";
import { Stepper } from "./(components)/stepper";
import { StepProvider, useSteps } from "./(components)/step-context";

interface LayoutProps {
  children: ReactNode;
}

function CreateStoreLayoutContent({ children }: LayoutProps) {
  const { currentStep } = useSteps();

  const stepperData = [
    {
      title: "Personal Details",
      status: currentStep > 1 ? "finish" : currentStep === 1 ? "process" : "wait",
    },
    {
      title: "Store Info",
      status: currentStep > 2 ? "finish" : currentStep === 2 ? "process" : "wait",
    },
    {
      title: "Payment Setup",
      status: currentStep > 3 ? "finish" : currentStep === 3 ? "process" : "wait",
    },
    {
      title: "Delivery Setup",
      status: currentStep > 4 ? "finish" : currentStep === 4 ? "process" : "wait",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
          {/* Stepper Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 h-fit">
              <Stepper data={stepperData} currentStep={currentStep} />
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3 lg:col-start-2">{children}</div>
        </div>
      </main>
    </div>
  );
}

export default function CreateStoreLayout({ children }: LayoutProps) {
  return (
    <StepProvider>
      <CreateStoreLayoutContent>{children}</CreateStoreLayoutContent>
    </StepProvider>
  );
}