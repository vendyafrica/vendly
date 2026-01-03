import type { ComponentProps } from "react";

import { cn } from "@vendly/ui/lib/utils";
import { Button } from "@vendly/ui/components/button";
import { Field, FieldGroup, FieldLabel } from "@vendly/ui/components/field";
import { Input } from "@vendly/ui/components/input";
import Link from "next/link";

import OnboardingShell from "@/components/onboarding/OnboardingShell";

export function PaymentsForm({
  className,
  ...props
}: ComponentProps<"form">) {
  return (
    <OnboardingShell
      title="Payments"
      description="Add a payout method"
    >
      <form className={cn("flex flex-col gap-6", className)} {...props}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="mpesaNumber">Mpesa Number</FieldLabel>
            <Input
              id="mpesaNumber"
              type="tel"
              placeholder="+254 7xx xxx xxx"
              required
            />
          </Field>
          <Field>
            <Link href="/sell/success">
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
