'use client';

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import SellOnboardingSteps from "@/components/onboarding/steps";

export default function StorefrontLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen w-full relative">
      {/* Radial Gradient Background from Top */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(125% 125% at 50% 10%, #fff 40%, #7c3aed 100%)",
        }}
      />
      
      {/* Logo in top left corner */}
      <div className="absolute top-6 left-6 z-20">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/vendly.png" alt="Vendly" width={32} height={32} />
          <span className="text-base font-semibold tracking-tight">vendly</span>
        </Link>
      </div>
      
      {/* Stepper + form content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-4xl">
          <SellOnboardingSteps>{children}</SellOnboardingSteps>
        </div>
      </div>
    </div>
  );
}
