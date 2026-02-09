import type { ReactNode } from "react";
import { Suspense } from "react";
import Image from "next/image";
import { headers } from "next/headers";
import { auth } from "@vendly/auth";

import { OnboardingProvider } from "./context/onboarding-context";
import { AppSessionProvider } from "@/contexts/app-session-context";

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
            <div className="min-h-dvh bg-muted flex flex-col overflow-auto">
              <header className="flex items-start justify-between p-4 md:p-6 shrink-0">
                <div className="flex items-center gap-1">
                  <Image src="/vendly.png" alt="Vendly" width={32} height={32} />
                  <span className="text-md font-semibold">vendly.</span>
                </div>
              </header>

              <main className="flex-1 flex items-center justify-center px-4 md:px-6 py-6">
                <div className="w-full max-w-4xl">{children}</div>
              </main>
            </div>
          </AppSessionProvider>
        }
      >
        <SessionBoundary sessionPromise={sessionPromise}>
          <div className="min-h-dvh bg-muted flex flex-col overflow-auto">
            <header className="flex items-start justify-between p-4 md:p-6 shrink-0">
              <div className="flex items-center gap-1">
                <Image src="/vendly.png" alt="Vendly" width={32} height={32} />
                <span className="text-md font-semibold">vendly.</span>
              </div>
            </header>

            <main className="flex-1 flex items-center justify-center px-4 md:px-6 py-6">
              <div className="w-full max-w-4xl">{children}</div>
            </main>
          </div>
        </SessionBoundary>
      </Suspense>
    </OnboardingProvider>
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
