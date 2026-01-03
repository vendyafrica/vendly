import type { ComponentProps } from "react";

import { cn } from "@vendly/ui/lib/utils";
import { Field, FieldGroup, FieldLabel } from "@vendly/ui/components/field";
import { Input } from "@vendly/ui/components/input";

export function BusinessForm({
  className,
  ...props
}: ComponentProps<"form">) {
  return (
    <div className="w-full max-w-4xl rounded-2xl py-10 gap-10">
      <div className="px-10">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight">Business Information</h1>
          <p className="text-muted-foreground text-sm text-balance mt-1">
            Tell us about your business
          </p>
        </div>
      </div>
      <div className="px-10">
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
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}
