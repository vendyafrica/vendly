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
    <div className="mx-auto w-full max-w-lg rounded-xl p-6 md:p-8 ">
      <form
        className="space-y-6 rounded-md p-8 shadow-md bg-background"
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
              className="focus-visible:border-primary/50 focus-visible:ring-primary/10"
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
              className="focus-visible:border-primary/50 focus-visible:ring-primary/10"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="location">Store location</FieldLabel>
            <Input
              id="location"
              placeholder="Location"
              value={storeLocation}
              onChange={(e) => setStoreLocation(e.target.value)}
              className="focus-visible:border-primary/50 focus-visible:ring-primary/10"
            />
          </Field>
        </FieldGroup>

        <div className="flex items-center justify-between pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={goBack}
            disabled={isLoading}
            className="bg-muted hover:bg-red-400 hover:text-white border-0"
          >
            Back
          </Button>

          <Button
            type="submit"
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90 hover:text-white"
          >
            {isLoading ? "Saving..." : "Continue"}
          </Button>
        </div>
      </form>
    </div>
  );
}
