import type { ComponentProps } from "react";

import { cn } from "@vendly/ui/lib/utils";
import { Field, FieldGroup, FieldLabel } from "@vendly/ui/components/field";
import { Input } from "@vendly/ui/components/input";

export function StoreSetupForm({
  className,
  ...props
}: ComponentProps<"form">) {
  return (
    <div className="w-full max-w-4xl rounded-2xl py-10 gap-10">
      <div className="px-10">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight">Store Setup</h1>
          <p className="text-muted-foreground text-sm text-balance mt-1">
            Set up your storefront
          </p>
        </div>
      </div>
      <div className="px-10">
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
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}
