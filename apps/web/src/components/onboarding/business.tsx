import type { ComponentProps } from "react";

import { cn } from "@vendly/ui/lib/utils";
import { Button } from "@vendly/ui/components/button";
import { Field, FieldGroup, FieldLabel } from "@vendly/ui/components/field";
import { Input } from "@vendly/ui/components/input";
import Link from "next/link";

import OnboardingShell from "@/components/onboarding/OnboardingShell";

export function BusinessForm({
  className,
  ...props
}: ComponentProps<"form">) {
  return (
    <OnboardingShell
      title="Business Information"
      description="Tell us about your business"
    >
      <form className={cn("flex flex-col gap-6", className)} {...props}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="businessName">Business Name</FieldLabel>
            <Input
              id="businessName"
              type="text"
              placeholder="Acme Ltd"
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="businessType">Business Type</FieldLabel>
            <Input
              id="businessType"
              type="text"
              placeholder="Retail"
              required
            />
          </Field>
          <Field>
            <Link href="/sell/store-setup">
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
