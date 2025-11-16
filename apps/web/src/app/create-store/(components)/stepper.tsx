// app/create-store/(components)/stepper.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTransform, motion, useMotionValue, animate } from "motion/react";

interface StepperEntry {
  title: string;
  status: "finish" | "process" | "wait";
}

export const Stepper = ({ data, currentStep }: { data: StepperEntry[], currentStep: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const progress = useMotionValue(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  useEffect(() => {
    const newProgress = (currentStep - 1) / (data.length - 1);
    animate(progress, newProgress, { duration: 0.5 });
  }, [currentStep, data.length, progress]);

  const heightTransform = useTransform(progress, [0, 1], [0, height]);
  const opacityTransform = useTransform(progress, [0, 0.1], [0, 1]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "finish":
        return "bg-primary";
      case "process":
        return "bg-primary";
      case "wait":
        return "bg-muted";
      default:
        return "bg-muted";
    }
  };

  const getTextColor = (status: string) => {
    switch (status) {
      case "finish":
        return "text-primary";
      case "process":
        return "text-primary";
      case "wait":
        return "text-muted-foreground";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div
      className="w-full bg-background font-sans"
      ref={containerRef}
    >
      <div ref={ref} className="relative max-w-2xl">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-10 md:pt-40 md:gap-10"
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-background dark:bg-foreground flex items-center justify-center">
                <div className={`h-4 w-4 rounded-full ${getStatusColor(item.status)} border border-muted`} />
              </div>
              <h3 className="hidden md:block text-xs md:text-sm font-medium md:pl-20 ${getTextColor(item.status)}">
                {item.title}
              </h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full md:hidden">
              <h3 className="block text-xs font-medium mb-4 text-left ${getTextColor(item.status)}">
                {item.title}
              </h3>
            </div>
          </div>
        ))}

        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-muted to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-primary via-primary to-transparent from-[0%] via-[10%] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};