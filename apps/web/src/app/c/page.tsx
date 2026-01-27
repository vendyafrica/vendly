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
import { signInWithGoogle, signInWithMagicLink, useSession } from "@vendly/auth/react";
import { useEffect, useState } from "react";
import { useOnboarding } from "./context/onboarding-context";
import { GoogleIcon } from "@vendly/ui/components/svgs/google";

type FormState = "idle" | "loading" | "sent";

export default function Welcome() {
  const session = useSession();
  const { navigateToStep } = useOnboarding();

  useEffect(() => {
    if (session.data) {
      navigateToStep("personal");
    }
  }, [session, navigateToStep]);
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Google sign-in failed:", error);
    }
  };

  const [email, setEmail] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [error, setError] = useState<string | null>(null);

  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setFormState("loading");

    try {
      await signInWithMagicLink(email);
      setFormState("sent");
    } catch {
      setError("Failed to send magic link. Please try again.");
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

        {/* RIGHT — Sign In Form */}
        {formState === "sent" ? (
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <h2 className="text-lg font-semibold">Check your email</h2>
            <p className="text-sm text-muted-foreground max-w-sm">
              We&apos;ve sent you a secure sign-in link. Click it to continue to
              Vendly.
            </p>
          </div>
        ) : (
          <form className="p-6 md:p-8" onSubmit={handleMagicLinkSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2">
                <h1 className="text-black-50 text-balance text-xl font-semibold ">
                  Welcome
                </h1>
                <p className="text-muted-foreground text-sm">
                  Create your free account
                </p>
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
                  className="focus-visible:border-primary/50 focus-visible:ring-primary/10 h-11"
                />
                {error && (
                  <p className="text-sm text-destructive mt-1">{error}</p>
                )}
              </Field>
              {/* 
                        <Field>
                            <div className="flex items-center">
                                <FieldLabel htmlFor="password">Password</FieldLabel>
                                <a
                                    href="#"
                                    className="ml-auto text-sm underline-offset-2 hover:underline"
                                >
                                    Forgot your password?
                                </a>
                            </div>
                            <Input
                             id="password"
                              type="password" 
                              required 
                              className="focus-visible:border-primary/50 focus-visible:ring-primary/10" 
                              value={formData.password}
                              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                              />
                        </Field> */}

              <Field>
                <Button
                  type="submit"
                  className="w-full h-11"
                  disabled={formState === "loading"}
                >
                  {formState === "loading" ? "Sending magic link…" : "Sign Up"}
                </Button>
              </Field>

              <FieldSeparator>continue with</FieldSeparator>

              <Field>
                <Button
                  variant="outline"
                  type="button"
                  className="h-11"
                  onClick={handleGoogleSignIn}
                >
                  <GoogleIcon />
                  Continue with Google
                </Button>
              </Field>
            </FieldGroup>
          </form>
        )}
      </div>
    </div>
  );
}
