import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@vendly/ui/components/stepper";

const steps = [
  {
    step: 1,
    title: "Personal",
  },
  {
    step: 2,
    title: "Business", 
  },
  {
    step: 3,
    title: "Store Setup",
  },
  {
    step: 4,
    title: "Payments",
  },
  {
    step: 5,
    title: "Success",
  },
];

function Steps({ currentStep = 1 }: { currentStep?: number }) {
  return (
    <div className="space-y-8 text-center min-w-[500px]">
      <Stepper defaultValue={currentStep}>
        {steps.map(({ step, title }) => (
          <StepperItem
            key={step}
            step={step}
            className="max-md:items-start [&:not(:last-child)]:flex-1"
          >
            <StepperTrigger className="max-md:flex-col">
              <StepperIndicator />
              <div className="text-center md:text-left">
                <StepperTitle>{title}</StepperTitle>
              </div>
            </StepperTrigger>
            {step < steps.length && <StepperSeparator className="max-md:mt-3.5 md:mx-4" />}
          </StepperItem>
        ))}
      </Stepper>
      <p className="mt-2 text-xs text-muted-foreground" role="region" aria-live="polite">
        Stepper with inline titles
      </p>
    </div>
  );
}

export { Steps };
