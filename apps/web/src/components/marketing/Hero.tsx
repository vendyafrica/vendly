"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HeroSection({ id }: { id?: string }) {
  return (
    <section
      className="relative overflow-hidden bg-background py-20 sm:py-28"
      id={id}
    >
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-primary/20 blur-[120px] glow-sync" />
      <div className="mx-auto max-w-5xl px-4 text-center">
        <h1 className="mt-8 text-4xl font-geist tracking-tight text-foreground sm:text-5xl md:text-6xl leading-tight">
          One <span className="text-primary">platform</span> to run your
          business
        </h1>
        
        <p className="mx-auto mt-5 max-w-2xl text-base text-black sm:text-lg leading-relaxed">
          Sell anywhere. Vendly gives you the tools to sell products anywhere,
          manage everything in one place, and grow your business faster.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/get-demo" className="inline-flex items-center gap-1">
              See Demo
            </Link>
          </Button>

          <Button asChild size="lg" variant="outline">
            <Link href="/contact">Contact</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
