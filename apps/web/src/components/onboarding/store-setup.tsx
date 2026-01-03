import type { ComponentProps } from "react";

import { cn } from "@vendly/ui/lib/utils";
import { Button } from "@vendly/ui/components/button";
import { Field, FieldGroup, FieldLabel } from "@vendly/ui/components/field";
import { Input } from "@vendly/ui/components/input";
import Link from "next/link";

import OnboardingShell from "@/components/onboarding/OnboardingShell";

export function StoreSetupForm({
  className,
  ...props
}: ComponentProps<"form">) {
  return (
    <OnboardingShell
      title="Store Setup"
      description="Set up your storefront"
    >
      <form className={cn("flex flex-col gap-6", className)} {...props}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="storeName">Store Name</FieldLabel>
            <Input id="storeName" type="text" placeholder="My Store" required />
          </Field>
          <Field>
            <FieldLabel htmlFor="storeSlug">Store URL</FieldLabel>
            <Input id="storeSlug" type="text" placeholder="my-store" required />
          </Field>
          <Field>
            <Link href="/sell/payments">
              <Button type="button" className="w-full">
                Continue
              </Button>
            </Link>
          </Field>
        </FieldGroup>
      </form>
    </OnboardingShell>
  );
}
