"use client";

import { Button } from "@vendly/ui/components/button";
import { Field, FieldGroup, FieldLabel } from "@vendly/ui/components/field";
import { Input } from "@vendly/ui/components/input";
import { Textarea } from "@vendly/ui/components/textarea";
import { Separator } from "@vendly/ui/components/separator";
import { Checkbox } from "@vendly/ui/components/checkbox";
import { Label } from "@vendly/ui/components/label";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { useOnboarding } from "../context/onboarding-context";
import { useAppSession } from "@/contexts/app-session-context";
import { PhoneInput } from "./phone-input";
import { SectionLabel } from "./section-label";

type FormState = "idle" | "loading";

function normalizePhone(countryCode: string, raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return null;
  let national = digits;
  if (digits.startsWith(countryCode)) national = digits.slice(countryCode.length);
  if (national.startsWith("0")) national = national.slice(1);
  if (!national) return null;
  return `+${countryCode}${national}`;
}

export function Step1Info() {
  const { session: appSession } = useAppSession();
  const { saveDraft, navigateToStep, data, isHydrated } = useOnboarding();
  const searchParams = useSearchParams();

  const [fullName, setFullName] = useState(data.personal?.fullName ?? "");
  const [phoneNumber, setPhoneNumber] = useState(data.personal?.phoneNumber ?? "");
  const [countryCode, setCountryCode] = useState(data.personal?.countryCode ?? "256");
  const [storeName, setStoreName] = useState(data.store?.storeName ?? "");
  const [storeDescription, setStoreDescription] = useState(data.store?.storeDescription ?? "");
  const [storeLocation, setStoreLocation] = useState(data.store?.storeLocation ?? "");
  const [agreed, setAgreed] = useState(false);
  const [formState, setFormState] = useState<FormState>("idle");
  const [error, setError] = useState<string | null>(null);

  const isLoading = formState === "loading";

  // Sync form fields from localStorage data once hydration completes
  // (useState initializers run before the hydration effect, so they start empty)
  useEffect(() => {
    if (!isHydrated) return;
    if (data.personal) {
      setFullName(prev => prev || data.personal!.fullName);
      setPhoneNumber(prev => prev || data.personal!.phoneNumber);
      setCountryCode(prev => prev || data.personal!.countryCode);
    }
    if (data.store) {
      setStoreName(prev => prev || data.store!.storeName);
      setStoreDescription(prev => prev || data.store!.storeDescription);
      setStoreLocation(prev => prev || data.store!.storeLocation);
    }
  }, [isHydrated, data.personal, data.store]);

  useEffect(() => {
    if (appSession && searchParams.get("step") === "2") navigateToStep("step2");
  }, [appSession, navigateToStep, searchParams]);

  const handleSubmit = async () => {
    setError(null);
    if (!fullName.trim()) return setError("Please enter your full name.");
    if (!storeName.trim()) return setError("Please enter your store name.");
    const normalizedPhone = normalizePhone(countryCode, phoneNumber);
    if (!normalizedPhone) return setError("Please enter a valid phone number.");
    if (!agreed) return setError("Please agree to the Terms and Privacy Policy.");

    saveDraft({
      fullName: fullName.trim(),
      phoneNumber: normalizedPhone,
      countryCode,
      storeName: storeName.trim(),
      storeDescription: storeDescription.trim(),
      storeLocation: storeLocation.trim(),
    });

    setFormState("loading");
    navigateToStep("step2");
  };

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-5 md:p-7 space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Set up your seller account</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          We&apos;ll use this to create your store on Vendly.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* ── Two columns: Personal | Store ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
        {/* Left col — About you */}
        <div className="space-y-3">
          <SectionLabel>About you</SectionLabel>
          <FieldGroup className="space-y-3">
            <Field>
              <FieldLabel htmlFor="fullName">Full Name *</FieldLabel>
              <Input
                id="fullName"
                type="text"
                autoComplete="name"
                placeholder="Jane Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isLoading}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="phoneNumber">Phone Number *</FieldLabel>
              <PhoneInput
                value={phoneNumber}
                countryCode={countryCode}
                onValueChange={setPhoneNumber}
                onCountryChange={setCountryCode}
                disabled={isLoading}
              />
            </Field>
          </FieldGroup>
        </div>

        {/* Right col — Your store */}
        <div className="space-y-3">
          <SectionLabel>Your store</SectionLabel>
          <FieldGroup className="space-y-3">
            <Field>
              <FieldLabel htmlFor="storeName">Store Name *</FieldLabel>
              <Input
                id="storeName"
                type="text"
                placeholder="Acme Fashion"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                disabled={isLoading}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="storeLocation">Location</FieldLabel>
              <Input
                id="storeLocation"
                type="text"
                placeholder="Kampala, Uganda"
                value={storeLocation}
                onChange={(e) => setStoreLocation(e.target.value)}
                disabled={isLoading}
              />
            </Field>
          </FieldGroup>
        </div>
      </div>

      {/* Description — full width */}
      <Field>
        <FieldLabel htmlFor="storeDescription">
          Store Description{" "}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </FieldLabel>
        <Textarea
          id="storeDescription"
          placeholder="Tell buyers what you sell and what makes your store special…"
          rows={2}
          value={storeDescription}
          onChange={(e) => setStoreDescription(e.target.value)}
          disabled={isLoading}
          className="focus-visible:border-primary/50 focus-visible:ring-primary/10 transition-colors"
        />
      </Field>

      <Separator />

      {/* CTA row */}
      <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-2.5">
          <Checkbox
            id="terms"
            checked={agreed}
            onCheckedChange={(c) => setAgreed(!!c)}
            disabled={isLoading}
            className="mt-0.5 shrink-0"
          />
          <Label
            htmlFor="terms"
            className="text-xs font-normal text-muted-foreground leading-relaxed cursor-pointer select-none"
          >
            I agree to the{" "}
            <a
              href="/terms"
              target="_blank"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              Terms
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              target="_blank"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              Privacy Policy
            </a>
            .
          </Label>
        </div>

        <Button
          type="button"
          variant="default"
          onClick={handleSubmit}
          disabled={isLoading || !agreed}
          className="w-full md:w-auto shrink-0"
        >
          {isLoading ? "Continuing…" : "Continue"}
        </Button>
      </div>
    </div>
  );
}