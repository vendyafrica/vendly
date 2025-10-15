"use client";

import React from "react";
import { BackgroundLines } from "@/components/ui/background-lines";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Waitlist() {
  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background py-24 sm:py-32">
      <BackgroundLines className="container relative flex w-full flex-col items-center justify-center px-6 sm:px-8">
        {/* Heading */}
        <h2 className="text-center font-sans text-4xl font-medium tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl leading-tight">
         Book your <span className="text-primary">vendly</span> store
        </h2>

        {/* Subheading */}
        <p className="mt-6 max-w-2xl text-center text-base text-muted-foreground sm:text-lg lg:text-xl">
          Reserve your storefront on the waitlist and get early access .
        </p>

        {/* Waitlist Input */}
        <div className="mt-10 flex w-full max-w-md flex-col sm:flex-row items-center gap-3 rounded-full bg-muted/40 p-2 backdrop-blur-sm border border-border/60">
          <Input
            type="text"
            placeholder="yourstore.vendly.store"
            className="h-12 flex-1 rounded-full border-none bg-transparent px-5 text-base placeholder:text-muted-foreground/70 focus-visible:ring-0 focus-visible:outline-none"
          />
          <Button
            size="lg"
            className="h-12 w-full sm:w-auto rounded-full px-6 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Join Waitlist
          </Button>
        </div>
      </BackgroundLines>
    </section>
  );
}
