"use client";

import { ReactNode, useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

interface LayoutProps {
  children: ReactNode;
  step: number;
  steps: string[];
}

export default function Layout({ children, step, steps }: LayoutProps) {
  // We use a ref to measure the height of the steps container
  const layoutRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  // This effect measures the total height of the steps
  // so we know how tall the animation line should be.
  useEffect(() => {
    if (layoutRef.current) {
      setHeight(layoutRef.current.offsetHeight);
    }
    // Re-calculate if the number of steps changes
  }, [steps]);

  // Calculate the animation progress (a value from 0 to 1)
  const progress = steps.length > 1 ? (step - 1) / (steps.length - 1) : 0;

  // --- Calculations for VERTICAL layout ---
  // We subtract the height of one step item (approx 56px)
  // so the line ends at the last step, not below it.
  const oneStepHeight = 56; // (mb-8 + h-6 = 32 + 24 = 56)
  const animatedHeight = Math.max(0, (height - oneStepHeight) * progress);
  
  // --- Calculation for HORIZONTAL layout ---
  const animatedWidth = `${progress * 100}%`;

  return (
    <div className="bg-background flex flex-col md:flex-row min-h-svh w-full p-6 md:p-10">
      
      {/* --- HORIZONTAL STEPS (Mobile) --- */}
      {/* This section is visible ONLY on small screens (md:hidden) */}
      <div className="w-full md:hidden mb-12">
        <div className="relative flex justify-between items-center w-full">
          {/* Progress Bar (Track) */}
          <div className="absolute top-2 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-700" />
          
          {/* Progress Bar (Animated) */}
          <motion.div
            className="absolute top-2 left-0 h-0.5 bg-purple-500"
            animate={{ width: animatedWidth }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          />

          {/* Step Dots & Labels */}
          {steps.map((label, index) => {
            const stepNumber = index + 1;
            const active = stepNumber === step;
            const completed = stepNumber < step;

            return (
              <div key={label} className="relative z-10 flex flex-col items-center">
                {/* Dot */}
                <div className={`h-4 w-4 rounded-full transition-all
                  ${(completed || active) ? "bg-purple-500" : "bg-gray-200 dark:bg-gray-700"}
                  ${active ? "ring-2 ring-purple-500 ring-offset-2 ring-offset-background" : ""}
                `}/>
                
                {/* Label */}
                <span className={`absolute top-6 w-24 text-center text-xs font-medium ${active ? "text-purple-500" : "text-gray-500"}`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- VERTICAL TIMELINE (Desktop) --- */}
      {/* This section is hidden on small screens (hidden md:flex) */}
      <div className="hidden md:flex flex-col items-start mr-10 w-48 relative">
        
        {/* This ref is used to measure the height of the container */}
        <div ref={layoutRef} className="absolute w-full -z-10">
          {/* This is a "ghost" layout just for measuring height */}
          {steps.map((label, index) => (
             <div key={index} className="flex items-center mb-8 h-6" />
          ))}
        </div>

        {/* Track line (behind) */}
        <div
          style={{ height: height > 0 ? height - oneStepHeight : 0 }}
          className="absolute left-3 top-0 overflow-hidden w-[2px] bg-gray-200 dark:bg-gray-700"
        />

        {/* Animated purple line */}
        <motion.div
          animate={{ height: animatedHeight }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="absolute left-3 top-0 w-[2px] bg-purple-500"
        />

        {/* Step dots and labels */}
        <div className="w-full">
          {steps.map((label, index) => {
            const stepNumber = index + 1;
            const active = stepNumber === step;
            const completed = stepNumber < step;

            return (
              <div
                key={index}
                // z-10 and bg-background make the item sit *on top* of the lines
                className="flex items-center mb-8 z-10 bg-background"
              >
                <div
                  className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all
                    ${completed ? "bg-purple-500 border-purple-500" : ""}
                    ${active ? "bg-background border-purple-500" : "bg-background border-gray-300"}
                  `}
                >
                  {completed ? (
                    <span className="text-white font-bold text-sm">✓</span>
                  ) : (
                    <span
                      className={`font-bold text-sm transition-colors ${
                        active ? "text-purple-500" : "text-gray-400"
                      }`}
                    >
                      {stepNumber}
                    </span>
                  )}
                </div>
                <span
                  className={`ml-4 font-medium transition-colors ${
                    active ? "text-purple-500" : "text-gray-500"
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- Main content --- */}
      <div className="flex-1 max-w-sm">{children}</div>
    </div>
  );
}