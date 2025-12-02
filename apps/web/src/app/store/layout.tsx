// app/create-store/layout.tsx
"use client";

import { ReactNode } from "react";
import { StepProvider, useSteps } from "./(components)/step-context";
import { Stepper } from "./(components)/stepper";

function StepperSidebar() {
  const { currentStep, goToStep } = useSteps();

  const stepperData = [
    { title: "Personal Details", status: (currentStep > 1 ? "finish" : currentStep === 1 ? "process" : "wait") as "finish" | "process" | "wait" },
    { title: "Store Info", status: (currentStep > 2 ? "finish" : currentStep === 2 ? "process" : "wait") as "finish" | "process" | "wait" },
    { title: "Payment Setup", status: (currentStep > 3 ? "finish" : currentStep === 3 ? "process" : "wait") as "finish" | "process" | "wait" },
    { title: "Delivery Setup", status: (currentStep > 4 ? "finish" : currentStep === 4 ? "process" : "wait") as "finish" | "process" | "wait" },
  ];

  return (
    <div className="hidden md:flex h-[400px] w-full items-center justify-center">
      <Stepper data={stepperData} currentStep={currentStep} onStepClick={goToStep} />
    </div>
  );
}


import { MobileStepper } from "./(components)/mobile-stepper";

function MobileTimeline() {
  const { currentStep, goToStep } = useSteps();

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


export default function CreateStoreLayout({ children }: { children: ReactNode }) {
  return (
    <StepProvider>
      <div className="h-screen bg-background dark:bg-background overflow-hidden flex flex-col">
        <div className="flex md:hidden flex-col h-screen">
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            <div className="w-full max-w-lg">
              <MobileTimeline />
              <div className="flex flex-col items-center">
                {children}
              </div>
            </div>
          </div>
        </div>
        <div className="hidden md:flex h-screen">
          <main className="flex-1 p-6">
            <div className="grid grid-cols-5 gap-8 h-full max-w-6xl mx-auto">
              <div className="col-span-1 h-full flex items-center justify-center">
                <StepperSidebar />
              </div>
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