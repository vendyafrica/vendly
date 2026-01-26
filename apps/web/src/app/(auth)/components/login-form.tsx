"use client"

import { useState } from "react"
import { cn } from "@vendly/ui/lib/utils"
import { Button } from "@vendly/ui/components/button"
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@vendly/ui/components/field"
import { Input } from "@vendly/ui/components/input"
import { signInWithGoogle, signInWithMagicLink } from "@vendly/auth/react"
import { HugeiconsIcon } from "@hugeicons/react"
import { MailReceive02Icon } from "@hugeicons/core-free-icons"
import { GoogleIcon } from "@vendly/ui/components/svgs/google"

type FormState = "idle" | "loading" | "sent"

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [email, setEmail] = useState("")
    const [formState, setFormState] = useState<FormState>("idle")
    const [error, setError] = useState<string | null>(null)

    const handleMagicLinkSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!email || !email.includes("@")) {
            setError("Please enter a valid email address")
            return
        }

        setFormState("loading")

        try {
            await signInWithMagicLink(email)
            setFormState("sent")
        } catch {
            setError("Failed to send magic link. Please try again.")
            setFormState("idle")
        }
    }

    if (formState === "sent") {
        return (
            <div className={cn("flex flex-col gap-6", className)} {...props}>
                <div className="flex flex-col items-center text-center gap-4 py-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                        <HugeiconsIcon icon={MailReceive02Icon} size={28} />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold">Check your email</h2>
                        <p className="text-sm text-muted-foreground max-w-[260px]">
                            We&apos;ve sent a magic link to{" "}
                            <span className="font-medium text-foreground">{email}</span>
                        </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Click the link in your email to sign in. The link expires in 5 minutes.
                    </p>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            setFormState("idle")
                            setEmail("")
                        }}
                        className="mt-2 text-xs"
                    >
                        Use a different email
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <form onSubmit={handleMagicLinkSubmit}>
                <FieldGroup className="gap-6">
                    <div className="text-start">
                        <h1 className="text-xl font-semibold">
                            Welcome to Vendly
                        </h1>
                    </div>

                    <Field>
                        <FieldLabel>Email</FieldLabel>
                        <Input
                            type="email"
                            inputMode="email"
                            autoComplete="email"
                            autoFocus={false}
                            placeholder="m@example.com"
                            className="h-11 sm:h-9"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={formState === "loading"}
                        />
                        {error && (
                            <p className="text-xs text-destructive mt-1">{error}</p>
                        )}
                    </Field>

                    <Button
                        type="submit"
                        className="h-11 sm:h-9 w-full text-sm sm:text-base"
                        disabled={formState === "loading"}
                    >
                        {formState === "loading" ? "Sending..." : "Continue with Email"}
                    </Button>

                    <FieldSeparator>Or</FieldSeparator>

                    <Button
                        variant="outline"
                        type="button"
                        onClick={() => signInWithGoogle()}
                        className="h-11 sm:h-9"
                        disabled={formState === "loading"}
                    >
                        <GoogleIcon />
                        Continue with Google
                    </Button>
                </FieldGroup>
            </form>
        </div>
    )
}
