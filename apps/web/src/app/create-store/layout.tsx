// app/create-store/layout.tsx
"use client";

import { ReactNode } from "react";
import { StepProvider, useSteps } from "./(components)/step-context";
import { Stepper } from "./(components)/stepper";

interface LayoutProps {
  children: ReactNode;
}

// Separate component to access step context for stepper - hidden on mobile
function StepperSidebar() {
  const { currentStep } = useSteps();

  const stepperData = [
    { title: "Personal Details", status: (currentStep > 1 ? "finish" : currentStep === 1 ? "process" : "wait") as "finish" | "process" | "wait" },
    { title: "Store Info", status: (currentStep > 2 ? "finish" : currentStep === 2 ? "process" : "wait") as "finish" | "process" | "wait" },
    { title: "Payment Setup", status: (currentStep > 3 ? "finish" : currentStep === 3 ? "process" : "wait") as "finish" | "process" | "wait" },
    { title: "Delivery Setup", status: (currentStep > 4 ? "finish" : currentStep === 4 ? "process" : "wait") as "finish" | "process" | "wait" },
  ];

  return (
    <div className="hidden md:flex h-[400px] w-full items-center justify-center">
      <Stepper data={stepperData} currentStep={currentStep} />
    </div>
  );
}

import { MobileStepper } from "./(components)/mobile-stepper";

// Mobile horizontal timeline component
function MobileTimeline() {
  const { currentStep } = useSteps();

  const stepperData = [
    { title: "Personal", status: (currentStep > 1 ? "finish" : currentStep === 1 ? "process" : "wait") as "finish" | "process" | "wait" },
    { title: "Store", status: (currentStep > 2 ? "finish" : currentStep === 2 ? "process" : "wait") as "finish" | "process" | "wait" },
    { title: "Payment", status: (currentStep > 3 ? "finish" : currentStep === 3 ? "process" : "wait") as "finish" | "process" | "wait" },
    { title: "Delivery", status: (currentStep > 4 ? "finish" : currentStep === 4 ? "process" : "wait") as "finish" | "process" | "wait" },
  ];

  return (
    <div className="block md:hidden">
      <MobileStepper data={stepperData} currentStep={currentStep} />
    </div>
  );
}

export default function CreateStoreLayout({ children }: LayoutProps) {
  return (
    <StepProvider>
      {/* Full viewport height, hidden overflow */}
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
        {/* Mobile Layout - Centered vertically and horizontally */}
        <div className="flex md:hidden flex-col min-h-screen">
          <div className="flex-1 flex flex-col justify-center items-center px-6">
            <div className="w-full max-w-lg">
              <MobileTimeline />
              <div className="flex flex-col items-center">
                {children}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout - Two column grid */}
        <div className="hidden md:flex min-h-screen">
          <main className="flex-1 p-6 overflow-auto">
            <div className="grid grid-cols-5 gap-8 h-full max-w-6xl mx-auto">
              {/* Left Column - Stepper */}
              <div className="col-span-1 h-full flex items-center justify-center">
                <StepperSidebar />
              </div>

              {/* Right Column - Form */}
              <div className="col-span-3 col-start-2 h-full flex items-center justify-center">
                <div className="w-full max-w-lg">
                  {children}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </StepProvider>
  );
}