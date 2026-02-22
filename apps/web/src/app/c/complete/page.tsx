"use client";

import { Button } from "@vendly/ui/components/button";
import { useState } from "react";
import { Instagram, Upload } from "lucide-react";

export default function Complete() {
  const [tenantSlug] = useState<string | null>(
    () => (typeof window !== "undefined" ? localStorage.getItem("vendly_tenant_slug") : null)
  );

  const adminBase = tenantSlug ? `/a/${tenantSlug}` : "/a";

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

        {/* CTAs */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            How do you want to start?
          </p>

          <div className="grid gap-2.5">
            {/* Instagram — using a wrapper div with bg class instead of inline style */}
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
      </div>
    </div>
  );
}