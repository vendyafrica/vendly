"use client";

import { useState, useEffect } from "react";
import { Button } from "@vendly/ui/components/button";
import { Field, FieldGroup } from "@vendly/ui/components/field";
import CategoriesSelector from "../components/categories";
import { useOnboarding } from "../context/onboarding-context";
import { getCategoriesAction } from "../lib/categories";
import { type Category } from "../components/tag-selector";

export default function BusinessInfo() {
  const { data, saveBusiness, completeOnboarding, goBack, isLoading, error } = useOnboarding();

  const [categories, setCategories] = useState<string[]>(data.business?.categories ?? []);
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getCategoriesAction();
      if (res.success && res.data) {
        const mapped = res.data.map((c: { slug: string; name: string }) => ({
          id: c.slug,
          label: c.name,
        }));
        setAvailableCategories(mapped);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (categories.length === 0) {
      return;
    }

    const saved = await saveBusiness({ categories });

    if (saved) {
      await completeOnboarding({ business: { categories } });
    }
  };

  return (
    <div className="mx-auto w-full max-w-lg rounded-xl p-0 md:p-8">
      <form className="space-y-7 rounded-md bg-background p-6 shadow-md md:p-8" onSubmit={handleSubmit}>
        {error && (
          <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
            {error}
          </p>
        )}

        <FieldGroup>
          <Field>
            <CategoriesSelector
              selectedCategories={categories}
              onChange={setCategories}
              availableCategories={availableCategories}
            />
          </Field>
        </FieldGroup>

        {categories.length === 0 && (
          <p className="text-sm text-muted-foreground">Please select at least one category</p>
        )}

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={goBack}
            disabled={isLoading}
            className="h-11 w-full border-0 bg-muted px-4 hover:bg-red-400 hover:text-white sm:w-auto"
          >
            Back
          </Button>

          <Button
            type="submit"
            disabled={isLoading || categories.length === 0}
            className="h-11 w-full bg-primary px-4 hover:bg-primary/90 hover:text-white sm:w-auto"
          >
            {isLoading ? "Creating store..." : "Create Store"}
          </Button>
        </div>
      </form>
    </div>
  );
}
