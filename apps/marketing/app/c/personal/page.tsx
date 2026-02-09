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

function extractNationalNumber(
  phoneNumber: string | undefined,
  countryCode: string
): string {
  if (!phoneNumber) return "";
  
  const digits = phoneNumber.replace(/\D/g, "");
  
  if (digits.startsWith(countryCode)) {
    const national = digits.slice(countryCode.length);
    return national.startsWith("0") ? national.slice(1) : national;
  }
  
  return digits.startsWith("0") ? digits.slice(1) : digits;
}

function inferCountryCode(raw: string | undefined): string {
  if (!raw) return "256";
  if (raw.startsWith("+254") || raw.startsWith("254")) return "254";
  return "256";
}

function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, "");
  
  // Format as: XXX XXX XXX
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)}`;
}

export default function PersonalInfo() {
  const { data, savePersonal, goBack, isLoading, error } = useOnboarding();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fullName, setFullName] = useState(data.personal?.fullName ?? "");
  
  const initialCountryCode = inferCountryCode(data.personal?.phoneNumber);
  const [countryCode, setCountryCode] = useState(initialCountryCode);
  
  const [nationalNumber, setNationalNumber] = useState(
    extractNationalNumber(data.personal?.phoneNumber, initialCountryCode)
  );

  const selectedCountry = COUNTRY_OPTIONS.find(
    (opt) => opt.code === countryCode,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const digits = nationalNumber.replace(/\D/g, "");
    if (!digits) return;

    const internationalNumber = `+${countryCode}${digits}`;

    setIsSubmitting(true);
    try {
      await savePersonal({ fullName, phoneNumber: internationalNumber });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only digits and spaces
    const cleaned = value.replace(/[^\d\s]/g, "");
    setNationalNumber(cleaned);
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
              className="mt-1.5 h-12 px-4 text-base"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="phoneNumber" className="text-base font-medium">
              Phone Number
            </FieldLabel>
            <div className="mt-1.5 flex h-14 overflow-hidden rounded-lg border border-input bg-background shadow-sm transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
              {/* Country Selector */}
              <Select value={countryCode} onValueChange={setCountryCode}>
                <SelectTrigger className="h-full w-auto min-w-[160px] gap-2 border-0 border-r bg-muted/30 pl-4 pr-3 shadow-none hover:bg-muted/50 focus:ring-0">
                  <SelectValue>
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl leading-none">
                        {selectedCountry?.flag}
                      </span>
                      <span className="text-sm font-medium">
                        {selectedCountry?.label}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        +{countryCode}
                      </span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="min-w-[220px]">
                  {COUNTRY_OPTIONS.map((opt) => (
                    <SelectItem 
                      key={opt.code} 
                      value={opt.code}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{opt.flag}</span>
                        <span className="flex-1 font-medium">{opt.label}</span>
                        <span className="text-sm text-muted-foreground">
                          +{opt.code}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Phone Input */}
              <Input
                id="phoneNumber"
                placeholder="700 000 000"
                type="tel"
                required
                value={formatPhoneNumber(nationalNumber)}
                onChange={handlePhoneChange}
                maxLength={11} // "XXX XXX XXX" = 11 chars with spaces
                className="h-full flex-1 border-0 bg-transparent px-4 text-base shadow-none focus-visible:ring-0"
              />
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