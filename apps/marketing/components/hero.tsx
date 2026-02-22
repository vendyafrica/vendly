"use client";

import { Button } from "./ui/button";
import Link from "next/link";

export function Hero() {
  return (
    <div className="min-h-[calc(100svh-4rem)] py-16 sm:py-20 lg:py-24 max-w-6xl mx-auto text-center px-6">
      <strong className="font-semibold text-sm uppercase tracking-[0.08em] text-muted-foreground/90">
        Instagram Store Builder for African Sellers
      </strong>
      <h1 className="mt-4 max-w-4xl mx-auto text-4xl sm:text-5xl lg:text-6xl leading-[1.05] font-semibold tracking-tight text-balance">
        Turn Instagram Into a Real Online Store
      </h1>
      <div className="mt-6 max-w-3xl mx-auto text-base sm:text-lg text-muted-foreground text-balance">
        <p>
          Showcase your catalog, share one link in bio, and receive WhatsApp
          orders without building a full website.
        </p>
      </div>
      <div className="mt-10 flex flex-wrap gap-3 sm:gap-4 justify-center">
        <Link href="https://www.duuka.store/c">
          <Button size="lg" className="min-w-36">
            Start Selling
          </Button>
        </Link>
        <Link href="/contact">
          <Button variant="outline" size="lg" className="min-w-36">
            Contact Us
          </Button>
        </Link>
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
