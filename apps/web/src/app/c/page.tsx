"use client";

import { Button } from "@vendly/ui/components/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@vendly/ui/components/field";
import { Input } from "@vendly/ui/components/input";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Store01FreeIcons,
  Payment01FreeIcons,
  Analytics01FreeIcons,
} from "@hugeicons/core-free-icons";
import { signInWithGoogle, signUp } from "@vendly/auth/react";
import { useEffect, useState } from "react";
import { useOnboarding } from "./context/onboarding-context";
import { GoogleIcon } from "@vendly/ui/components/svgs/google";
import { useAppSession } from "@/contexts/app-session-context";

type FormState = "idle" | "loading";

export default function Welcome() {
  const { session: appSession } = useAppSession();
  const { navigateToStep, setPersonalDraft } = useOnboarding();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (appSession) {
      setPersonalDraft({ fullName: appSession.user?.name ?? "" });
      navigateToStep("personal");
    }
  }, [appSession, navigateToStep, setPersonalDraft]);

  const getOnboardingRedirect = () => {
    if (typeof window === "undefined") {
      return "/c/personal?entry=seller_google";
    }
    return `${window.location.origin}/c/personal?entry=seller_google`;
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle({
        callbackURL: getOnboardingRedirect(),
      });
    } catch (error) {
      console.error("Google sign-in failed:", error);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter your full name");
      return;
    }
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setFormState("loading");

    try {
      // Precheck if this email already belongs to a seller
      const res = await fetch(`/api/seller/precheck?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        const precheck = await res.json() as { isSeller: boolean; adminStoreSlug?: string | null; tenantSlug?: string | null };
        if (precheck.isSeller) {
          const adminSlug = precheck.adminStoreSlug || precheck.tenantSlug;
          setError(`An account with this email already exists. Please sign in at /a/${adminSlug}/login`);
          setFormState("idle");
          return;
        }
      }

      const { error: signUpError } = await signUp(email, password, name);

      if (signUpError) {
        if (signUpError.message?.toLowerCase().includes("already")) {
          setError("An account with this email already exists. Please sign in instead.");
        } else {
          setError(signUpError.message || "Sign up failed. Please try again.");
        }
        setFormState("idle");
        return;
      }

      navigateToStep("personal");
    } catch {
      setError("Something went wrong. Please try again.");
      setFormState("idle");
    }
  };

  return (
    <div className="border-0 shadow-sm rounded-sm bg-muted/30">
      <div className="grid p-0 md:grid-cols-2 gap-4">
        {/* LEFT — Marketing / Context */}
        <div className="hidden md:flex flex-col justify-center items-start p-10 max-w-xl">
          <h2 className="text-xl font-semibold tracking-tight mb-4">
            Start selling smarter with Vendly
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            All tools to manage and scale your business.
          </p>

          <div className="space-y-5 w-full">
            <div className="flex items-start gap-2">
              <div className="p-3 rounded-xl shrink-0">
                <HugeiconsIcon
                  icon={Store01FreeIcons}
                  className="h-4 w-4 text-primary"
                />
              </div>
              <div>
                <h3 className="text-md  font-semibold mb-2">
                  Customizable Storefront
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Customizable storefront to sell your products online.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="p-3 rounded-xl shrink-0">
                <HugeiconsIcon
                  icon={Payment01FreeIcons}
                  className="h-4 w-4 text-primary"
                />
              </div>
              <div>
                <h3 className="text-md font-semibold mb-2">
                  Checkout & Delivery
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Payments and delivery infrastructure out of the box.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="p-3 rounded-xl shrink-0">
                <HugeiconsIcon
                  icon={Analytics01FreeIcons}
                  className="h-4 w-4 text-primary"
                />
              </div>
              <div>
                <h3 className="text-md font-semibold mb-2">
                  Advanced Business Analytics
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Get insights into your business performance.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — Sign Up Form */}
        <form className="p-6 md:p-8" onSubmit={handleSignUp}>
          <FieldGroup>
            <div className="flex flex-col items-center gap-2">
              <h1 className="text-black-50 text-balance text-xl font-semibold ">
                Welcome
              </h1>
              <p className="text-muted-foreground text-sm">
                Create your free account
              </p>
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={formState === "loading"}
                className="focus-visible:border-primary/50 focus-visible:ring-primary/10 h-11"
              />
            </Field>

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
                disabled={formState === "loading"}
                className="focus-visible:border-primary/50 focus-visible:ring-primary/10 h-11"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={formState === "loading"}
                className="focus-visible:border-primary/50 focus-visible:ring-primary/10 h-11"
              />
            </Field>

            <Field>
              <Button
                type="submit"
                className="w-full h-11"
                disabled={formState === "loading"}
              >
                {formState === "loading" ? "Creating account…" : "Sign Up"}
              </Button>
            </Field>

            <FieldSeparator>or continue with</FieldSeparator>

            <Field>
              <Button
                variant="outline"
                type="button"
                className="h-11"
                onClick={handleGoogleSignIn}
                disabled={formState === "loading"}
              >
                <GoogleIcon />
                Continue with Google
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}
