// app/create-store/(components)/mobile-stepper.tsx
"use client";

interface StepperEntry {
  title: string;
  status: "finish" | "process" | "wait";
}

interface MobileStepperProps {
  data: StepperEntry[];
  currentStep: number;
}

export const MobileStepper = ({ data, currentStep }: MobileStepperProps) => {
  return (
    <div className="w-full py-4 px-4 mb-6">
      <div className="flex items-center justify-center gap-4">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex items-center"
          >
            {/* Dot indicator */}
            <div className={`h-2 w-2 rounded-full ${
              item.status === "finish" ? "bg-primary" :
              item.status === "process" ? "bg-primary" :
              "bg-muted"
            }`} />
            {index < data.length - 1 && (
              <div className={`ml-4 w-8 h-[1px] ${
                index < currentStep - 1 ? 'bg-primary' : 'bg-muted'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};