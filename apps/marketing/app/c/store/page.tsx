"use client";

import { useState } from "react";
import { Button } from "@vendly/ui/components/button";
import { Field, FieldGroup, FieldLabel } from "@vendly/ui/components/field";
import { Input } from "@vendly/ui/components/input";
import { Textarea } from "@vendly/ui/components/textarea";
import { useOnboarding } from "../context/onboarding-context";

export default function StoreInfo() {
  const { data, saveStore, goBack, isLoading, error } = useOnboarding();

  const [storeName, setStoreName] = useState(data.store?.storeName ?? "");
  const [storeDescription, setStoreDescription] = useState(
    data.store?.storeDescription ?? ""
  );
  const [storeLocation, setStoreLocation] = useState(data.store?.storeLocation ?? "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveStore({ storeName, storeDescription, storeLocation });
  };

  return (
    <div className="mx-auto w-full max-w-lg rounded-xl p-0 md:p-8">
      <form
        className="space-y-7 rounded-md bg-background p-6 shadow-md md:p-8"
        onSubmit={handleSubmit}
      >
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">Tell us about your store</h1>
          <p className="text-sm text-muted-foreground">
            This helps us personalize your storefront
          </p>
        </div>

        {error && (
          <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
            {error}
          </p>
        )}

        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="storeName">Store name</FieldLabel>
            <Input
              id="storeName"
              type="text"
              placeholder="Acme Fashion"
              required
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="h-11 px-3 focus-visible:border-primary/50 focus-visible:ring-primary/10"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="storeDescription">Store description</FieldLabel>
            <Textarea
              id="storeDescription"
              placeholder="What do you sell? Tell your customers about your store..."
              rows={3}
              value={storeDescription}
              onChange={(e) => setStoreDescription(e.target.value)}
              className="min-h-[96px] px-3 py-2.5 focus-visible:border-primary/50 focus-visible:ring-primary/10"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="location">Store location</FieldLabel>
            <Input
              id="location"
              placeholder="Location"
              value={storeLocation}
              onChange={(e) => setStoreLocation(e.target.value)}
              className="h-11 px-3 focus-visible:border-primary/50 focus-visible:ring-primary/10"
            />
          </Field>
        </FieldGroup>

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
            disabled={isLoading}
            className="h-11 w-full bg-primary px-4 hover:bg-primary/90 hover:text-white sm:w-auto"
          >
            {isLoading ? "Saving..." : "Continue"}
          </Button>
        </div>
      </form>
    </div>
  );
}
