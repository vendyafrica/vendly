"use client";

import { OnboardingProvider } from "../../components/providers/onboarding-provider";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OnboardingProvider>
      <div className="relative min-h-screen flex flex-col overflow-hidden">
        {/* Background gradient */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(125% 125% at 50% 10%, #fff 40%, #7c3aed 100%)",
          }}
        />

        {/* Page content */}
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-4xl">
            {children}
          </div>
        </main>
      </div>
    </OnboardingProvider>
  );
}
