"use client";

import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 text-center">
        {/* Main Heading */}
        <h1 className="mt-8 text-4xl font-geist tracking-tight text-foreground sm:text-5xl md:text-6xl leading-tight">
          One <span className="text-primary">platform</span> to run your
          business
        </h1>

        {/* Subtext */}
        <p className="mx-auto mt-5 max-w-2xl text-base text-black sm:text-lg leading-relaxed">
          Sell anywhere. Vendly gives you the tools to sell products anywhere,
          manage everything in one place, and grow your business faster.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg">See Demo</Button>
          <Button size="lg" variant="outline">
            Contact 
          </Button>
        </div>
      </div>
    </section>
  );
}
