// app/create-store/(components)/personal-details.tsx
"use client";

import { cn } from "@/lib/utils";
import { Button } from "@vendly/ui/components/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@vendly/ui/components/field";
import {
  ButtonGroup,
  ButtonGroupText,
} from "@vendly/ui/components/button-group";
import { InputGroup, InputGroupInput } from "@vendly/ui/components/input-group";
import { Label } from "@vendly/ui/components/label";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { HTMLAttributes } from "react";
import { useSteps } from "./step-context";
import { useState } from "react";
import { InstagramIcon } from "@vendly/ui/components/svgs/instagramIcon";

interface PersonalDetailsFormProps extends HTMLAttributes<HTMLDivElement> {
  onNext?: () => void;
  currentStep?: number;
}
export function PersonalDetailsForm({
  className,
  onNext,
  currentStep = 1,
  ...props
}: PersonalDetailsFormProps) {
  const { formData, setFormData } = useSteps();
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);

  const createSlug = (text: string) => {
    return text.toLowerCase().replace(/\s+/g, "-");
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSlug = createSlug(e.target.value);
    setFormData({
      slug: newSlug,
      storeName: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.storeName) {
      setError("Please enter your store name.");
      return;
    }
    onNext?.();
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <FieldGroup>
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Image
              src="/apple-icon.png"
              alt="vendly logo"
              width={32}
              height={32}
            />
            <span className="font-bold text-lg text-foreground">vendly.</span>
          </Link>
          <Field>
            <FieldLabel htmlFor="slug">Store Name</FieldLabel>
            <ButtonGroup>
              <InputGroup>
                <InputGroupInput
                  id="slug"
                  placeholder="zara-store"
                  value={formData.storeName || ""}
                  onChange={handleSlugChange}
                />
              </InputGroup>
              <ButtonGroupText asChild>
                <Label htmlFor="slug">.vendly.africa</Label>
              </ButtonGroupText>
            </ButtonGroup>
            <FieldDescription>
              Your unique store URL will be:{" "}
              {formData.slug ? (
                <span className="cursor-pointer underline hover:text-primary">
                  {formData.slug}.vendly.africa
                </span>
              ) : (
                "..."
              )}
            </FieldDescription>
          </Field>
          <Field>
            <Button type="submit" variant={"outline"} className="cursor-pointer">
              <Image src="/instagram-icon.svg" alt="Instagram Icon" width={18} height={18} />
              Connect Store
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
