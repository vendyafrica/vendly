"use client";

import { Button } from "@vendly/ui/components/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@vendly/ui/components/field";
import { Input } from "@vendly/ui/components/input";
import { useState } from "react";
import { useOnboarding } from "./context/onboarding-context";
import { useRouter } from "next/navigation";

type FormState = "idle" | "loading" | "sent";

export default function Welcome() {
  const router = useRouter();
  const { navigateToStep, setSellerIdentity } = useOnboarding();

  const [email, setEmail] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [error, setError] = useState<string | null>(null);

  const handleEmailContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setFormState("loading");

    try {
      const res = await fetch("/api/seller/precheck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        throw new Error("Failed to check seller status");
      }

      const data = (await res.json()) as {
        status: "exists" | "ok";
        adminStoreSlug?: string | null;
        tenantSlug?: string | null;
        userId?: string;
        email?: string;
      };

      if (data.status === "exists") {
        const adminSlug = data.adminStoreSlug || data.tenantSlug;
        setError(
          adminSlug
            ? `This email already has a store. Log in at duuka.store/a/${adminSlug}.`
            : "This email already has a store. Please log in on duuka.store."
        );
        setFormState("idle");
        return;
      }

      if (!data.userId || !data.email) {
        throw new Error("Failed to initialize seller profile");
      }

      setSellerIdentity({ userId: data.userId, email: data.email });
      navigateToStep("personal");
      router.push("/c/personal");
    } catch {
      setError("Failed to check email. Please try again.");
      setFormState("idle");
    }
  };

  return (
    <div className="border-0 shadow-sm rounded-lg bg-muted/30 p-6 md:p-8 max-w-lg mx-auto">
      {formState === "sent" ? (
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <h2 className="text-lg font-semibold">Check your email</h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            We&apos;ve sent you a secure sign-in link. Click it to continue to Vendly.
          </p>
        </div>
      ) : (
        <form className="space-y-5" onSubmit={handleEmailContinue}>
          <FieldGroup className="space-y-4">
            <div className="flex flex-col items-center gap-2">
              <h1 className="text-black-50 text-balance text-xl font-semibold">Welcome</h1>
              <p className="text-muted-foreground text-sm">Create your free account</p>
            </div>

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="focus-visible:border-primary/50 focus-visible:ring-primary/10 h-11 px-3"
              />
              {error && <p className="text-sm text-destructive mt-1">{error}</p>}
            </Field>

            <Field>
              <Button type="submit" className="w-full h-11 px-4" disabled={formState === "loading"}>
                {formState === "loading" ? "Checking email…" : "Continue"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      )}
    </div>
  );
}
