// app/create-store/(components)/stepper.tsx
"use client";

import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface StepperEntry {
  title: string;
  status: "finish" | "process" | "wait";
}

// --- ADDED onStepClick PROP ---
export const Stepper = ({
  data,
  currentStep,
  onStepClick
}: {
  data: StepperEntry[],
  currentStep: number,
  onStepClick?: (step: number) => void // Prop for clickable steps
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [containerHeight, setContainerHeight] = useState(0);
  const translateY = useMotionValue(0);
  const beamHeight = useMotionValue(0);

  // Measure container height
  useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.clientHeight);
    }
  }, []);

  // Animate transform and beam when step changes
  useEffect(() => {
    // This logic relies on stepRefs being 0-indexed (0, 1, 2, 3)
    const activeStep = stepRefs.current[currentStep - 1];
    if (!activeStep || !containerRef.current || containerHeight === 0) return;

    const stepOffsetTop = activeStep.offsetTop;
    const stepHeight = activeStep.offsetHeight;

    // Calculate transform to center active step vertically
    const targetTranslate = stepOffsetTop + stepHeight / 2 - containerHeight / 2;

    // Smooth animation
    animate(translateY, targetTranslate, {
      duration: 0.5,
      ease: "easeInOut",
      type: "tween"
    });

    // Animate beam to point to active step center
    animate(beamHeight, stepOffsetTop + stepHeight / 2, {
      duration: 0.5,
      ease: "easeInOut"
    });
  }, [currentStep, containerHeight]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "finish": return "bg-primary";
      case "process": return "bg-primary";
      case "wait": return "bg-muted";
      default: return "bg-muted";
    }
  };

  const getTextColor = (status: string) => {
    switch (status) {
      case "finish": return "text-primary";
      case "process": return "text-primary";
      case "wait": return "text-muted-foreground";
      default: return "text-muted-foreground";
    }
  };

 return (
    <div className="w-full bg-background font-sans h-full relative" ref={containerRef}>
      {/* Beam - gradient line */}
      <div className="absolute md:left-8 left-8 top-0 h-full overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-muted to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] pointer-events-none">
        <motion.div
          style={{ height: beamHeight }}
          className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-primary via-primary to-transparent from-[0%] via-[10%] rounded-full"
        />
      </div>

      {/* Steps - animated with transform (no scrollbar) */}
      <motion.div
        className="relative"
        style={{ y: useTransform(translateY, (y) => -y) }}
      >
        {data.map((item, index) => (
          <div
            key={index}
            
            // --- FIX ---
            // The ref array should be 0-indexed (0, 1, 2, 3)
            ref={(el) => { stepRefs.current[index] = el; }}
            
            // --- ADDED ---
            // Add click handler and cursor
            className="flex justify-start py-10 md:py-20 cursor-pointer"
            onClick={() => onStepClick?.(index + 1)} // (index + 1) is the step number
          >
            {/* Dot indicator */}
            <div className="relative flex flex-col md:flex-row z-40 items-center max-w-xs lg:max-w-sm md:w-full">
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-background dark:bg-foreground flex items-center justify-center">
                <div className={`h-4 w-4 rounded-full ${getStatusColor(item.status)} border border-muted`} />
              </div>
              <h3 className={`hidden md:block text-xs md:text-sm font-medium md:pl-20 ${getTextColor(item.status)}`}>
                {item.title}
              </h3>
            </div>

            {/* Mobile title */}
            <div className="relative pl-20 pr-4 md:pl-4 w-full md:hidden">
              <h3 className={`block text-xs font-medium mb-4 text-left ${getTextColor(item.status)}`}>
                {item.title}
              </h3>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};