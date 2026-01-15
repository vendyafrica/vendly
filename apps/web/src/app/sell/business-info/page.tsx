"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "../../../components/providers/onboarding-provider";
import { Button } from "@vendly/ui/components/button";
import { Input } from "@vendly/ui/components/input";
import { Label } from "@vendly/ui/components/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@vendly/ui/components/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@vendly/ui/components/card";

export default function BusinessInfoPage() {
    const router = useRouter();
    const { businessInfo, updateBusinessInfo, setStep } = useOnboarding();
    const [localInfo, setLocalInfo] = useState(businessInfo);

    useEffect(() => {
        setStep(1);
    }, [setStep]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        // Auto-generate slug
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
        setLocalInfo(prev => ({ ...prev, storeName: name, slug }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Basic validation
        if (!localInfo.storeName || !localInfo.slug) return;

        updateBusinessInfo({
            ...localInfo,
            tenantName: localInfo.tenantName || localInfo.storeName // Default tenant name to store name
        });

        router.push("/sell/personal-info");
    };

    return (
        <Card className="w-full max-w-lg mx-auto">
            <CardHeader>
                <CardTitle>Tell us about your business</CardTitle>
                <CardDescription>We'll help you get set up in minutes.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="storeName">Store Name</Label>
                        <Input
                            id="storeName"
                            placeholder="e.g. Acme Clothing"
                            value={localInfo.storeName || ""}
                            onChange={handleNameChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug">Store url</Label>
                        <div className="flex items-center space-x-2">
                            <Input
                                id="slug"
                                value={localInfo.slug || ""}
                                placeholder="e.g. acme-clothing"
                                onChange={(e) => setLocalInfo({ ...localInfo, slug: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <div className="flex items-center space-x-2">
                            <Input
                                id="category"
                                value={localInfo.category || ""}
                                placeholder="e.g. acme-clothing"
                                onChange={(e) => setLocalInfo({ ...localInfo, category: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full">
                        Continue
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}