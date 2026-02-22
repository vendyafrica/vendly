"use client";

import { Button } from "@vendly/ui/components/button";
import { useEffect, useState } from "react";
import { Instagram, Upload } from "lucide-react";

export default function Complete() {
  const [tenantSlug, setTenantSlug] = useState<string | null>(null);
  const [storeSlug, setStoreSlug] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTenantSlug(localStorage.getItem("vendly_tenant_slug"));
    setStoreSlug(localStorage.getItem("vendly_store_slug"));
  }, []);

  const adminBase = tenantSlug ? `/a/${tenantSlug}` : "/a";

  if (!mounted) {
    return (
      <div className="w-full max-w-lg mx-auto">
        <div className="rounded-xl border bg-background shadow-sm p-8 flex items-center justify-center min-h-[240px]">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="rounded-xl border bg-background shadow-sm p-6 md:p-8 space-y-8 text-center">
        {/* Success icon */}
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
            <svg
              className="h-8 w-8 text-green-600 dark:text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Your store is ready! 🎉
            </h1>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Congratulations! You&apos;re all set. Now let&apos;s get your first customers.
            </p>
          </div>
        </div>

        {/* CTAs */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Choose how to get started
          </p>

          <div className="grid gap-3">
            <Button
              size="lg"
              className="w-full h-14 text-white"
              style={{ background: "linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)" }}
            >
              <a href={`${adminBase}/instagram`} className="flex items-center justify-center gap-3">
                <Instagram className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-semibold text-sm">Connect Instagram</div>
                  <div className="text-xs opacity-80 font-normal">Import your products from Instagram</div>
                </div>
              </a>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full h-14"
            >
              <a href={`${adminBase}/products/new`} className="flex items-center justify-center gap-3">
                <Upload className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-semibold text-sm">Upload Sample Products</div>
                  <div className="text-xs text-muted-foreground font-normal">Add your first products manually</div>
                </div>
              </a>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground pt-2">
            You can always do this later from your dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
