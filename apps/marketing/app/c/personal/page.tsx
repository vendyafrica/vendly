"use client";

import { useState } from "react";
import { Button } from "@vendly/ui/components/button";
import { Field, FieldGroup, FieldLabel } from "@vendly/ui/components/field";
import { Input } from "@vendly/ui/components/input";
import { PhoneInput, phoneSchema } from "@/components/ui/phone-input";
import { useOnboarding } from "../context/onboarding-context";

function inferDefaultCountry(raw: string | undefined): string {
  if (!raw) return "UG";
  if (raw.startsWith("+254") || raw.startsWith("254")) return "KE";
  return "UG";
}

export default function PersonalInfo() {
  const { data, savePersonal, goBack, isLoading, error } = useOnboarding();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fullName, setFullName] = useState(data.personal?.fullName ?? "");
  const [phoneNumber, setPhoneNumber] = useState(
    data.personal?.phoneNumber ?? ""
  );
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const defaultCountry = inferDefaultCountry(data.personal?.phoneNumber);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = phoneSchema.safeParse(phoneNumber);
    if (!parsed.success) {
      setPhoneError("Please enter a valid phone number");
      return;
    }

    setIsSubmitting(true);
    try {
      setPhoneError(null);
      await savePersonal({ fullName, phoneNumber });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-lg rounded-xl p-0 md:p-8">
      <form
        className="space-y-6 rounded-md bg-background p-6 shadow-md md:p-8"
        onSubmit={handleSubmit}
      >
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Tell us about you</h1>
          <p className="text-sm text-muted-foreground">
            This helps your customers reach you
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-destructive/10 p-3">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <FieldGroup className="space-y-5">
          <Field>
            <FieldLabel htmlFor="fullName" className="text-base font-medium">
              Full Name
            </FieldLabel>
            <Input
              id="fullName"
              type="text"
              placeholder="Steve McQueen"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1.5 h-10 px-3 text-sm"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="phoneNumber" className="text-base font-medium">
              Phone Number
            </FieldLabel>
            <div className="mt-1.5">
              <PhoneInput
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter your phone number"
                defaultCountry={defaultCountry}
                allowedCountries={["UG", "KE"]}
                className="h-10"
                required
              />
              {phoneError && (
                <p className="mt-1 text-sm text-destructive">{phoneError}</p>
              )}
            </div>
          </Field>
        </FieldGroup>

        <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={goBack}
            disabled={isLoading || isSubmitting}
            className="h-11 px-8 transition-colors hover:bg-muted"
          >
            Back
          </Button>

          <Button
            type="submit"
            disabled={isLoading || isSubmitting}
            className="h-11 px-8 transition-colors"
          >
            {isSubmitting ? "Saving..." : "Continue"}
          </Button>
        </div>
      </form>
    </div>
  );
}