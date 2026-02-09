"use client";

import { Button } from "./ui/button";
import dynamic from "next/dynamic";

const Typewriter = dynamic(
  () => import("@/components/ui/typewriter").then((m) => m.Typewriter),
  { ssr: false }
);

export function Hero() {
  return (
    <div className="min-h-[calc(100svh-4rem)] py-16 sm:py-20 lg:py-24 max-w-6xl mx-auto text-center px-6">
      <strong className="font-semibold text-sm uppercase tracking-[0.08em] text-muted-foreground/90">
        All-in-one commerce for social selling
      </strong>
      <h1 className="mt-4 max-w-4xl mx-auto text-4xl sm:text-5xl lg:text-6xl leading-[1.05] font-semibold tracking-tight text-balance">
        Build your brand. Own your customers.
      </h1>
      <div className="mt-6 max-w-3xl mx-auto text-base sm:text-lg text-muted-foreground text-balance">
        <p>
          <span>Dream big, </span>
          <Typewriter
            text={["Sell everywhere."]}
            speed={35}
            deleteSpeed={35}
            waitTime={3000}
            initialDelay={250}
            className="text-primary/80"
            cursorChar="_"
          />
        </p>
      </div>
      <div className="mt-10 flex flex-wrap gap-3 sm:gap-4 justify-center">
        <Button size="lg" className="min-w-36">
          Start Selling
        </Button>
        <Button variant="outline" size="lg" className="min-w-36">
          Contact Us
        </Button>
      </div>

      <div className="mt-16 sm:mt-20 overflow-hidden rounded-2xl border bg-muted/70 shadow-xl">
        <div className="relative h-full w-full aspect-4/3 sm:aspect-video flex items-center justify-center p-4 sm:p-8 lg:p-10">
          {/* Subtle grid background */}
          <div
            className="absolute inset-2 sm:inset-3 z-0 rounded-xl opacity-15"
            style={{
              backgroundImage: `
          linear-gradient(to right, var(--border) 1px, transparent 1px),
          linear-gradient(to bottom, var(--border) 1px, transparent 1px)
        `,
              backgroundSize: "18px 18px",
              backgroundPosition: "0 0, 0 0",
            }}
          />

          {/* Dashboard Image */}
          <img
            src="/dashboard.png"
            alt="Vendly Dashboard"
            className="relative z-10 h-full w-full object-contain object-center drop-shadow-xl"
          />
        </div>
      </div>
    </div>
  );
}
