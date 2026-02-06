import type { ReactNode } from "react";
import { Suspense } from "react";
import { headers } from "next/headers";

import { auth } from "@vendly/auth";

import { CartProvider } from "@/contexts/cart-context";
import { AppSessionProvider } from "@/contexts/app-session-context";
import { PostHogProvider, Providers } from "../providers";

export default async function MarketplaceLayout({
  children,
}: {
  children: ReactNode;
}) {
  const headerList = await headers();
  const sessionPromise = auth.api.getSession({ headers: headerList });

  return (
    <PostHogProvider>
      <Providers>
        <Suspense
          fallback={
            <AppSessionProvider session={null}>
              <CartProvider>{children}</CartProvider>
            </AppSessionProvider>
          }
        >
          <SessionBoundary sessionPromise={sessionPromise}>
            <CartProvider>{children}</CartProvider>
          </SessionBoundary>
        </Suspense>
      </Providers>
    </PostHogProvider>
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
