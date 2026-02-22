"use client";

import { Button } from "@vendly/ui/components/button";
import { Field, FieldGroup, FieldLabel } from "@vendly/ui/components/field";
import { Input } from "@vendly/ui/components/input";
import { Textarea } from "@vendly/ui/components/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@vendly/ui/components/select";
import { Separator } from "@vendly/ui/components/separator";
import { signInWithGoogle } from "@vendly/auth/react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { useOnboarding } from "./context/onboarding-context";
import { GoogleIcon } from "@vendly/ui/components/svgs/google";
import { useAppSession } from "@/contexts/app-session-context";
import CategoriesSelector from "./components/categories";
import { getCategoriesAction } from "./lib/categories";
import { type Category } from "./components/tag-selector";
import { Checkbox } from "@vendly/ui/components/checkbox";
import { Label } from "@vendly/ui/components/label";


type FormState = "idle" | "loading";

const COUNTRY_OPTIONS = [
  { code: "256", label: "Uganda", flag: "🇺🇬" },
  { code: "254", label: "Kenya", flag: "🇰🇪" },
];

function normalizePhone(countryCode: string, raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return null;
  let national = digits;
  if (digits.startsWith(countryCode)) national = digits.slice(countryCode.length);
  if (national.startsWith("0")) national = national.slice(1);
  if (!national) return null;
  return `+${countryCode}${national}`;
}

// ─── Step Indicator ──────────────────────────────────────────────────────────

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={
            i + 1 === current
              ? "h-1.5 w-6 rounded-full bg-primary transition-all"
              : i + 1 < current
                ? "h-1.5 w-4 rounded-full bg-primary/40 transition-all"
                : "h-1.5 w-4 rounded-full bg-muted transition-all"
          }
        />
      ))}
      <span className="text-xs text-muted-foreground ml-1">
        Step {current} of {total}
      </span>
    </div>
  );
}

// ─── Section Label ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
      {children}
    </p>
  );
}

// ─── Root Router ─────────────────────────────────────────────────────────────

export default function OnboardingRoute() {
  const { currentStep } = useOnboarding();
  return currentStep === "step2" ? <Step2Categories /> : <Step1Info />;
}

// ─── Step 1: Info + Google Sign-Up ───────────────────────────────────────────

function Step1Info() {
  const { session: appSession } = useAppSession();
  const { saveDraft, navigateToStep, data } = useOnboarding();
  const searchParams = useSearchParams();

  const [fullName, setFullName] = useState(data.personal?.fullName ?? "");
  const [phoneNumber, setPhoneNumber] = useState(data.personal?.phoneNumber ?? "");
  const [countryCode, setCountryCode] = useState<string>(data.personal?.countryCode ?? "256");
  const [storeName, setStoreName] = useState(data.store?.storeName ?? "");
  const [storeDescription, setStoreDescription] = useState(data.store?.storeDescription ?? "");
  const [storeLocation, setStoreLocation] = useState(data.store?.storeLocation ?? "");
  const [agreed, setAgreed] = useState(false);
  const [formState, setFormState] = useState<FormState>("idle");

  const [error, setError] = useState<string | null>(null);

  const selectedCountry = COUNTRY_OPTIONS.find((o) => o.code === countryCode);
  const isLoading = formState === "loading";

  useEffect(() => {
    const stepParam = searchParams.get("step");
    if (appSession && stepParam === "2") navigateToStep("step2");
  }, [appSession, navigateToStep, searchParams]);

  const getCallbackURL = () =>
    typeof window === "undefined"
      ? "/c?entry=seller_google&step=2"
      : `${window.location.origin}/c?entry=seller_google&step=2`;

  const handleGoogleSignUp = async () => {
    setError(null);
    if (!fullName.trim()) return setError("Please enter your full name.");
    if (!storeName.trim()) return setError("Please enter your store name.");
    const normalizedPhone = normalizePhone(countryCode, phoneNumber);
    if (!normalizedPhone) return setError("Please enter a valid phone number.");

    saveDraft({
      fullName: fullName.trim(),
      phoneNumber: normalizedPhone,
      countryCode,
      storeName: storeName.trim(),
      storeDescription: storeDescription.trim(),
      storeLocation: storeLocation.trim(),
    });

    setFormState("loading");
    try {
      await signInWithGoogle({ callbackURL: getCallbackURL() });
    } catch {
      setError("Google sign-up failed. Please try again.");
      setFormState("idle");
    }
  };

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 md:p-10 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <StepIndicator current={1} total={2} />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Set up your seller account</h1>
          <p className="text-sm text-muted-foreground mt-1">
            We'll use this to create your store on Vendly.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* ── Personal Info ── */}
        <div className="space-y-4">
          <SectionLabel>About you</SectionLabel>
          <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              {/* Phone: country selector + number input sharing one border */}
              <div className="flex h-9 rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 overflow-hidden">
                <Select
                  value={countryCode}
                  onValueChange={(v) => setCountryCode(v ?? countryCode)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-[68px] shrink-0 rounded-none border-0 border-r border-input bg-muted/40 shadow-none focus:ring-0 focus-visible:ring-0 gap-1 px-2">
                    <SelectValue>
                      <span className="text-base leading-none">{selectedCountry?.flag}</span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent align="start" className="min-w-[200px]">
                    {COUNTRY_OPTIONS.map((opt) => (
                      <SelectItem key={opt.code} value={opt.code}>
                        <span className="flex items-center gap-2">
                          <span>{opt.flag}</span>
                          <span>{opt.label}</span>
                          <span className="text-xs text-muted-foreground">+{opt.code}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="780 000 000"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={isLoading}
                  className="flex-1 rounded-none border-0 shadow-none focus-visible:ring-0"
                />
              </div>
            </Field>
          </FieldGroup>
        </div>

        <Separator />

        {/* ── Store Info ── */}
        <div className="space-y-4">
          <SectionLabel>Your store</SectionLabel>
          <FieldGroup className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>

            <Field>
              <FieldLabel htmlFor="storeDescription">
                Store Description{" "}
                <span className="text-muted-foreground font-normal">(optional)</span>
              </FieldLabel>
              <Textarea
                id="storeDescription"
                placeholder="Tell buyers what you sell and what makes your store special…"
                rows={3}
                value={storeDescription}
                onChange={(e) => setStoreDescription(e.target.value)}
                disabled={isLoading}
              />
            </Field>
          </FieldGroup>
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-6 pt-4 border-t border-border">
        <div className="flex items-start gap-2.5">
          <Checkbox
            id="terms"
            checked={agreed}
            onCheckedChange={(checked) => setAgreed(!!checked)}
            disabled={isLoading}
            className="mt-0.5"
          />
          <Label
            htmlFor="terms"
            className="text-xs font-normal text-muted-foreground leading-relaxed cursor-pointer select-none"
          >
            I agree to the{" "}
            <a href="/terms" target="_blank" className="underline underline-offset-2 hover:text-foreground transition-colors" onClick={(e) => e.stopPropagation()}>
              Terms
            </a>{" "}
            and{" "}
            <a href="/privacy" target="_blank" className="underline underline-offset-2 hover:text-foreground transition-colors" onClick={(e) => e.stopPropagation()}>
              Privacy Policy
            </a>
            .
          </Label>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignUp}
          disabled={isLoading || !agreed}
          className="w-full md:w-auto shrink-0"
        >
          <GoogleIcon />
          {isLoading ? "Redirecting…" : "Continue with Google"}
        </Button>
      </div>
    </div>
  );
}

// ─── Step 2: Categories ───────────────────────────────────────────────────────

function Step2Categories() {
  const { data, completeOnboarding, goBack, isLoading, error } = useOnboarding();

  const [categories, setCategories] = useState<string[]>(data.business?.categories ?? []);
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategoriesAction().then((res) => {
      if (res.success && res.data) {
        setAvailableCategories(res.data.map((c) => ({ id: c.slug, label: c.name })));
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (categories.length === 0) return;
    await completeOnboarding({ business: { categories } });
  };

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 md:p-10 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <StepIndicator current={2} total={2} />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">What do you sell?</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Pick one or more categories. This helps buyers find your store.
          </p>
        </div>
      </div>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <FieldGroup>
          <Field>
            <CategoriesSelector
              selectedCategories={categories}
              onChange={setCategories}
              availableCategories={availableCategories}
            />
          </Field>
        </FieldGroup>

        {categories.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Select at least one category to continue.
          </p>
        )}

        <div className="flex items-center justify-between border-t border-border pt-4">
          <Button type="button" variant="outline" onClick={goBack} disabled={isLoading}>
            Back
          </Button>

          <Button type="submit" disabled={isLoading || categories.length === 0}>
            {isLoading ? "Setting up your store…" : "Finish setup"}
          </Button>
        </div>
      </form>
    </div>
  );
}