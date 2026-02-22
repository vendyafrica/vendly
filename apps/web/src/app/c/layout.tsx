import type { ReactNode } from "react";
import { Suspense } from "react";
import Image from "next/image";
import { headers } from "next/headers";
import { auth } from "@vendly/auth";

import { OnboardingProvider } from "./context/onboarding-context";
import { AppSessionProvider } from "@/contexts/app-session-context";
import { StepIndicator } from "./components/step-indicator";

export default async function OnboardingLayout({
  children,
}: {
  children: ReactNode;
}) {
  const headerList = await headers();
  const sessionPromise = auth.api.getSession({ headers: headerList });

  return (
    <OnboardingProvider>
      <Suspense
        fallback={
          <AppSessionProvider session={null}>
            <OnboardingShell>{children}</OnboardingShell>
          </AppSessionProvider>
        }
      >
        <SessionBoundary sessionPromise={sessionPromise}>
          <OnboardingShell>{children}</OnboardingShell>
        </SessionBoundary>
      </Suspense>
    </OnboardingProvider>
  );
}

function OnboardingShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-muted flex flex-col overflow-auto">
      <header className="flex items-center justify-between px-4 py-3 md:px-8 md:py-4 border-b border-border bg-background shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image src="/vendly.png" alt="Vendly" width={28} height={28} />
          <span className="text-base font-semibold tracking-tight">vendly.</span>
        </div>

        {/* Progress */}
        <StepIndicator />
      </header>

      <main className="flex-1 flex justify-center px-4 md:px-6 py-10 md:py-16">
        <div className="w-full max-w-2xl">{children}</div>
      </main>
    </div>
  );
}

async function SessionBoundary({
  children,
  sessionPromise,
}: {
  children: ReactNode;
  sessionPromise: ReturnType<typeof auth.api.getSession>;
}) {
  const session = await sessionPromise;
  return <AppSessionProvider session={session}>{children}</AppSessionProvider>;
}