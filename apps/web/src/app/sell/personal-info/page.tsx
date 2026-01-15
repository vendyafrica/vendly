"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "../../../components/providers/onboarding-provider";
import { useSession } from "../../../lib/auth";
import { Button } from "@vendly/ui/components/button";
import { Input } from "@vendly/ui/components/input";
import { Label } from "@vendly/ui/components/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@vendly/ui/components/card";

export default function PersonalInfoPage() {
    const router = useRouter();
    const { setStep, updateBusinessInfo, businessInfo } = useOnboarding();
    const { data: session } = useSession();

    const [localInfo, setLocalInfo] = useState({
        fullName: "",
        email: "",
        phone: businessInfo.phone || "",
    });

    // Update form when session loads
    useEffect(() => {
        if (session?.user) {
            setLocalInfo(prev => ({
                ...prev,
                fullName: session.user.name || prev.fullName,
                email: session.user.email || prev.email,
            }));
        }
    }, [session]);

    useEffect(() => {
        setStep(2);
    }, [setStep]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Update phone in business info
        updateBusinessInfo({
            phone: localInfo.phone
        });

        router.push("/sell/preview");
    };

    return (
        <Card className="w-full max-w-lg mx-auto">
            <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Tell us a bit about yourself.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                            id="fullName"
                            placeholder="e.g. John Doe"
                            value={localInfo.fullName}
                            onChange={(e) => setLocalInfo({ ...localInfo, fullName: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="e.g. john@example.com"
                            value={localInfo.email}
                            onChange={(e) => setLocalInfo({ ...localInfo, email: e.target.value })}
                            required
                            disabled={!!session?.user?.email}
                        />
                        {session?.user?.email && (
                            <p className="text-xs text-gray-500">Email from your account</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="+254..."
                            value={localInfo.phone}
                            onChange={(e) => setLocalInfo({ ...localInfo, phone: e.target.value })}
                            required
                        />
                    </div>

                    <div className="flex gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={() => router.push("/sell/business-info")}
                        >
                            Back
                        </Button>
                        <Button type="submit" className="flex-1">
                            Continue
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
