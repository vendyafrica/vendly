import type { ComponentProps } from "react";

import { cn } from "@vendly/ui/lib/utils";
import { Button } from "@vendly/ui/components/button";
import { Field, FieldGroup, FieldLabel } from "@vendly/ui/components/field";
import { Input } from "@vendly/ui/components/input";
import Link from "next/link";

import OnboardingShell from "@/components/onboarding/OnboardingShell";

export function PersonalForm({
  className,
  ...props
 }: ComponentProps<"form">) {
  return (
    <OnboardingShell
      title="Personal Information"
      description="Enter your details to continue"
    >
      <form className={cn("flex flex-col gap-6", className)} {...props}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input id="name" type="text" placeholder="John Doe" required />
          </Field>
          <Field>
            <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="city">City</FieldLabel>
            <Input id="city" type="text" placeholder="San Francisco" required />
          </Field>
          <Field>
            <Link href="/sell/business">
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
