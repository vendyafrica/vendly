"use client";

import type { ReactNode } from "react";

export default function SellerOnboardingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-6 py-12">
        {children}
      </div>
    </div>
  );
}
