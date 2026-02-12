"use client";

import { useState } from "react";
import { Button } from "@vendly/ui/components/button";
import { Field, FieldGroup, FieldLabel } from "@vendly/ui/components/field";
import { Input } from "@vendly/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@vendly/ui/components/select";
import { useOnboarding } from "../context/onboarding-context";

const COUNTRY_OPTIONS = [
  { code: "256", label: "Uganda", flag: "🇺🇬" },
  { code: "254", label: "Kenya", flag: "🇰🇪" },
];

function normalizePhone(countryCode: string, raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return null;

  let national = digits;

  if (digits.startsWith(countryCode)) {
    national = digits.slice(countryCode.length);
  }

  if (national.startsWith("0")) {
    national = national.slice(1);
  }

  if (!national) return null;
  return `+${countryCode}${national}`;
}

function inferCountryCode(raw: string | undefined): string {
  if (!raw) return "256";
  if (raw.startsWith("+254")) return "254";
  if (raw.startsWith("254")) return "254";
  return "256";
}

export default function PersonalInfo() {
  const { data, savePersonal, goBack, isLoading, error } = useOnboarding();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [fullName, setFullName] = useState(data.personal?.fullName ?? "");
  const [phoneNumber, setPhoneNumber] = useState(
    data.personal?.phoneNumber ?? "",
  );
  const [countryCode, setCountryCode] = useState(
    inferCountryCode(data.personal?.phoneNumber),
  );
  const selectedCountry = COUNTRY_OPTIONS.find(
    (opt) => opt.code === countryCode,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const normalized = normalizePhone(countryCode, phoneNumber);
    if (!normalized) {
      return;
    }

    setIsSubmitting(true);
    try {
      await savePersonal({ fullName, phoneNumber: normalized, countryCode });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-lg rounded-xl p-0 md:p-8 ">
      <form
        className="space-y-6 rounded-md p-6 md:p-8 shadow-md bg-background"
        onSubmit={handleSubmit}
      >
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">Tell us about you</h1>
          <p className="text-sm text-muted-foreground">
            This helps your customers reach you
          </p>
        </div>

        {error && (
          <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
            {error}
          </p>
        )}

        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
            <Input
              id="fullName"
              type="text"
              placeholder="Steve McQueen"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="focus-visible:border-primary/50 focus-visible:ring-primary/10"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="phoneNumber">Phone Number</FieldLabel>
            <div className="flex h-10 items-center gap-1 rounded-md border border-input bg-background px-2 focus-within:ring-2 focus-within:ring-primary/20">
              <Select
                value={countryCode}
                onValueChange={(val) => setCountryCode(val ?? countryCode)}
              >
                <SelectTrigger className="h-10 w-[80px] md:w-[170px] border-0 bg-transparent px-2 md:px-3 shadow-none focus-visible:ring-0">
                  <SelectValue>
                    <span className="flex items-center gap-2 text-sm font-medium">
                      <span>{selectedCountry?.flag}</span>
                      <span className="text-muted-foreground hidden md:inline">{selectedCountry?.label}</span>
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent align="start" className="min-w-[180px]">
                  {COUNTRY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.code} value={opt.code}>
                      <span className="flex items-center gap-2">
                        <span>{opt.flag}</span>
                        <span className="font-medium">{opt.label}</span>
                        <span className="text-xs text-muted-foreground">
                          +{opt.code}
                        </span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="h-full w-px bg-border mx-0.5 self-stretch" />
              <span className="text-sm text-muted-foreground whitespace-nowrap pl-1">+{countryCode}</span>
              <Input
                id="phoneNumber"
                placeholder="780 000 000"
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="flex-1 border-0 px-0 focus-visible:ring-0 focus-visible:border-0"
              />
            </div>
          </Field>
        </FieldGroup>

        {/* Actions */}
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
            disabled={isLoading || isSubmitting}
            className="bg-primary hover:bg-primary/90 hover:text-white"
          >
            {isSubmitting ? "Saving..." : "Continue"}
          </Button>
        </div>
      </form>
    </div>
  );
}
