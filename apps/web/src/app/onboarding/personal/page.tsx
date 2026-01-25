"use client";

import { useState } from "react";
import { Button } from "@vendly/ui/components/button";
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@vendly/ui/components/field";
import { Input } from "@vendly/ui/components/input";
import { useOnboarding } from "../context/onboarding-context";

export default function PersonalInfo() {
    const { data, savePersonal, goBack, isLoading, error } = useOnboarding();

    const [fullName, setFullName] = useState(data.personal?.fullName ?? "");
    const [phoneNumber, setPhoneNumber] = useState(data.personal?.phoneNumber ?? "");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await savePersonal({ fullName, phoneNumber });
    };

    return (
        <div className="mx-auto w-full max-w-lg rounded-xl p-6 md:p-8 ">
            <form className="space-y-6 rounded-md p-8 shadow-md bg-background" onSubmit={handleSubmit}>
                {/* Header */}
                <div className="space-y-1">
                    <h1 className="text-xl font-semibold">
                        Tell us about you
                    </h1>
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
                        <FieldLabel htmlFor="fullName">
                            Full Name
                        </FieldLabel>
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
                        <FieldLabel htmlFor="phoneNumber">
                            Phone Number
                        </FieldLabel>
                        <Input
                            id="phoneNumber"
                            placeholder="+254 700 000 000"
                            type="tel"
                            required
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="focus-visible:border-primary/50 focus-visible:ring-primary/10"
                        />
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
                        disabled={isLoading}
                        className="bg-primary hover:bg-primary/90 hover:text-white"
                    >
                        {isLoading ? "Saving..." : "Continue"}
                    </Button>
                </div>
            </form>
        </div>
    )
}
