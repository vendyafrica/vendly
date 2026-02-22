"use client";

import { Button } from "@vendly/ui/components/button";
import { useEffect, useState } from "react";

import { useOnboarding } from "../context/onboarding-context";
import { getCategoriesAction } from "../lib/categories";
import { CategoriesSelector, type Category } from "../components/category-selector";

export function Step2Categories() {
  const { data, completeOnboarding, goBack, isLoading, error } = useOnboarding();

  const [categories, setCategories] = useState<string[]>(data.business?.categories ?? []);
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategoriesAction().then((res) => {
      if (res.success && res.data) {
        setAvailableCategories(res.data.map((c) => ({ id: c.slug, label: c.name })));
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (categories.length === 0) return;
    await completeOnboarding({ business: { categories } });
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

        <div className="flex items-center justify-between border-t border-border pt-4">
          <Button type="button" variant="outline" onClick={goBack} disabled={isLoading}>
            Back
          </Button>
          <Button type="submit" disabled={isLoading || categories.length === 0}>
            {isLoading ? "Setting up your store…" : "Finish setup"}
          </Button>
        </div>
      </form>
    </div>
  );
}