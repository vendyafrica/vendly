"use client";

import { Button } from "@vendly/ui/components/button";
import { GoogleIcon } from "@vendly/ui/components/svgs/google";
import { signInWithGoogle } from "@vendly/auth/react";
import { useEffect, useMemo, useState } from "react";

import { useOnboarding } from "../context/onboarding-context";
import { getCategoriesAction } from "../lib/categories";
import { CategoriesSelector, type Category } from "../components/category-selector";
import { useAppSession } from "@/contexts/app-session-context";

export function Step2Categories() {
  const { session: appSession } = useAppSession();
  const { data, completeOnboarding, goBack, isLoading, error, saveBusinessDraft } = useOnboarding();

  const [categories, setCategories] = useState<string[]>(data.business?.categories ?? []);
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    getCategoriesAction().then((res) => {
      if (res.success && res.data) {
        setAvailableCategories(res.data.map((c) => ({ id: c.slug, label: c.name })));
      }
    });
  }, []);

  const getCallbackURL = useMemo(
    () => () =>
      typeof window === "undefined"
        ? "/c/complete"
        : `${window.location.origin}/c/complete`,
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (categories.length === 0) return;
    // Persist categories before any auth redirect
    saveBusinessDraft({ categories });

    if (appSession?.user) {
      await completeOnboarding({ business: { categories } });
      return;
    }

    try {
      setAuthLoading(true);
      await signInWithGoogle({ callbackURL: getCallbackURL() });
    } catch {
      setAuthLoading(false);
    }
  };

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-5 md:p-7 space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight">What do you sell?</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Pick the categories that best describe your products.
        </p>
      </div>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 px-4 py-2.5 rounded-md">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <CategoriesSelector
          availableCategories={availableCategories}
          selectedCategories={categories}
          onChange={setCategories}
          maxSelections={5}
        />

        <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
          <Button type="button" variant="outline" onClick={goBack} disabled={isLoading || authLoading}>
            Back
          </Button>
          <div className="flex flex-col md:flex-row gap-2 md:gap-3">
            {appSession?.user ? (
              <Button
                type="submit"
                variant="default"
                className="min-w-[200px]"
                disabled={isLoading || authLoading || categories.length === 0}
              >
                {isLoading ? "Setting up your store…" : "Finish setup"}
              </Button>
            ) : (
              <Button
                type="submit"
                variant="outline"
                className="min-w-[200px]"
                disabled={isLoading || authLoading || categories.length === 0}
              >
                {authLoading || isLoading ? (
                  "Continue with Google…"
                ) : (
                  <span className="flex items-center gap-2">
                    <GoogleIcon />
                    Continue with Google
                  </span>
                )}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}