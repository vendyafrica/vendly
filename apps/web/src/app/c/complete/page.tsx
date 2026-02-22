"use client";

import { Button } from "@vendly/ui/components/button";
import { useEffect, useRef, useState } from "react";
import { Instagram, Upload } from "lucide-react";
import { useOnboarding } from "../context/onboarding-context";

export default function Complete() {
  const { isComplete, completeOnboarding, isLoading, isHydrated, error } = useOnboarding();

  // tenantSlug is only available AFTER completeOnboarding succeeds,
  // so we read it reactively instead of in a useState initializer.
  const [tenantSlug, setTenantSlug] = useState<string | null>(null);
  const didAttemptRef = useRef(false);

  // Finalize onboarding once hydrated (e.g. after Google OAuth redirect)
  useEffect(() => {
    if (!isHydrated || isComplete || didAttemptRef.current) return;
    didAttemptRef.current = true;

    (async () => {
      await completeOnboarding();
    })();
  }, [isHydrated, isComplete, completeOnboarding]);

  // Read tenantSlug from localStorage once onboarding is complete
  useEffect(() => {
    if (isComplete) {
      setTenantSlug(localStorage.getItem("vendly_tenant_slug"));
    }
  }, [isComplete]);

  const adminBase = tenantSlug ? `/a/${tenantSlug}` : "/a";
  const showLoading = (isLoading || !isHydrated) && !isComplete;

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 md:p-8 space-y-7 text-center">
        {/* Success icon */}
        <div className="flex flex-col items-center gap-3">
          <div className="h-14 w-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <svg
              className="h-7 w-7 text-green-600 dark:text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Your store is ready! 🎉</h1>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              You&apos;re all set. Now let&apos;s get your first customers.
            </p>
          </div>
        </div>

        {/* CTAs / Loading / Error */}
        {error && !isLoading ? (
          <div className="space-y-3">
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                didAttemptRef.current = false;
                completeOnboarding();
              }}
            >
              Try again
            </Button>
          </div>
        ) : showLoading ? (
          <p className="text-sm text-muted-foreground">Finishing your setup…</p>
        ) : (
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
              How do you want to start?
            </p>

            <div className="grid gap-2.5">
              {/* Instagram */}
              <a href={`${adminBase}/instagram`} className="block">
                <Button
                  size="lg"
                  className="w-full h-14 bg-gradient-to-r from-purple-600 via-red-500 to-orange-400 text-white border-0 hover:opacity-90 transition-opacity"
                >
                  <Instagram className="h-5 w-5 shrink-0" />
                  <div className="text-left ml-1">
                    <div className="font-semibold text-sm leading-tight">Connect Instagram</div>
                    <div className="text-xs opacity-80 font-normal leading-tight">
                      Import products directly from your posts
                    </div>
                  </div>
                </Button>
              </a>

              <a href={`${adminBase}/products/new`} className="block">
                <Button variant="outline" size="lg" className="w-full h-14">
                  <Upload className="h-5 w-5 shrink-0" />
                  <div className="text-left ml-1">
                    <div className="font-semibold text-sm leading-tight">Add Products Manually</div>
                    <div className="text-xs text-muted-foreground font-normal leading-tight">
                      Upload photos and set your prices
                    </div>
                  </div>
                </Button>
              </a>
            </div>

            <p className="text-xs text-muted-foreground">
              You can always do this later from your dashboard.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}