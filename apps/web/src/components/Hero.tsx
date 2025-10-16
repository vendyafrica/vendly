"use client";

import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 text-center">
        {/* Main Heading */}
        <h1 className="mt-8 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl leading-tight">
          One <span className="text-primary">platform</span> to run your
          business
        </h1>

        {/* Subtext */}
        <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg leading-relaxed">
          Sell anyway. Vendly gives you the tools to sell products anywhere,
          manage everything in one place, and grow your business faster.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Button
            size="lg"
            className="rounded-full h-12 px-8 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Get started
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full h-12 px-8 text-base font-semibold border-border text-foreground hover:bg-muted/40"
          >
            Contact sales
          </Button>
        </div>
      </div>
    </section>
  );
}
