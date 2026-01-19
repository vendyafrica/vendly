"use client";

import { Button } from "@vendly/ui/components/button";
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@vendly/ui/components/field";
import { Input } from "@vendly/ui/components/input";
import { signUp } from "../../../lib/auth";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function SignUpForm() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        startTransition(async () => {
            const formData = new FormData(e.currentTarget);
            const name = formData.get("name") as string;
            const email = formData.get("email") as string;
            const password = formData.get("password") as string;

            try {
                const { data, error } = await signUp(email, password, name);

                if (error) {
                    setError(
                        error.message ||
                            error.status === 403
                            ? "Please verify your email address first."
                            : "Invalid email or password. Please try again."
                    );
                    return;
                }

                router.push("/dashboard");
                router.refresh();
            } catch (err: any) {
                setError(
                    err?.message || "An unexpected error occurred. Please try again."
                );
            }
        });
    };

    return (
        <div className="border-0 shadow-sm rounded-sm bg-muted/30">
            <div className="p-6 md:p-8">
                <form onSubmit={handleEmailSubmit}>
                    <FieldGroup>
                        <div className="flex flex-col items-center gap-2 mb-6">
                            <h1 className="text-foreground text-xl font-semibold tracking-tight">
                                Welcome to vendly
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                Sign up to continue
                            </p>
                        </div>

                        {error && (
                            <div className="mb-5 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                                {error}
                            </div>
                        )}
                        <Field>
                            <FieldLabel htmlFor="full_name">Full Name</FieldLabel>
                            <Input
                                id="full_name"
                                name="full_name"
                                type="text"
                                placeholder="Steve Jobs"
                                required
                                autoComplete="full_name"
                                disabled={isPending}
                                className="focus-visible:border-primary/60 focus-visible:ring-primary/20"
                            />
                        </Field>


                        <Field>
                            <FieldLabel htmlFor="email">Email address</FieldLabel>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                                required
                                autoComplete="email"
                                disabled={isPending}
                                className="focus-visible:border-primary/60 focus-visible:ring-primary/20"
                            />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="password">Password</FieldLabel>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                autoComplete="current-password"
                                disabled={isPending}
                                className="focus-visible:border-primary/60 focus-visible:ring-primary/20"
                            />
                        </Field>

                        <Field>
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isPending}
                            >
                                {isPending ? "Signing up..." : "Sign up"}
                            </Button>
                        </Field>
                    </FieldGroup>
                </form>
            </div>
        </div>
    );
}