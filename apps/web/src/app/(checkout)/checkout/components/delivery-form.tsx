"use client";

import { useState } from "react";
import { Input } from "@vendly/ui/components/input";
import { Label } from "@vendly/ui/components/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@vendly/ui/components/select";

export interface DeliveryFormData {
    email: string;
    country: string;
    firstName: string;
    lastName: string;
    address: string;
    apartment: string;
    postalCode: string;
    city: string;
    phone: string;
}

interface DeliveryFormProps {
    data: DeliveryFormData;
    onChange: (data: DeliveryFormData) => void;
}

const COUNTRIES = [
    { code: "KE", name: "Kenya" },
    { code: "UG", name: "Uganda" },
    { code: "TZ", name: "Tanzania" },
    { code: "NG", name: "Nigeria" },
    { code: "ZA", name: "South Africa" },
    { code: "GH", name: "Ghana" },
    { code: "US", name: "United States" },
    { code: "GB", name: "United Kingdom" },
    { code: "DE", name: "Germany" },
];

export function DeliveryForm({ data, onChange }: DeliveryFormProps) {
    const updateField = (field: keyof DeliveryFormData, value: string) => {
        onChange({ ...data, [field]: value });
    };

    return (
        <div className="space-y-6">
            {/* Email Section */}
            <div className="flex items-center justify-between py-4 border-b border-neutral-200">
                <span className="text-sm text-neutral-600">{data.email || "Enter your email"}</span>
                <button className="text-neutral-400 hover:text-neutral-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <circle cx="10" cy="4" r="2" />
                        <circle cx="10" cy="10" r="2" />
                        <circle cx="10" cy="16" r="2" />
                    </svg>
                </button>
            </div>

            {/* Delivery Section */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Delivery</h2>

                <div className="space-y-4">
                    {/* Country */}
                    <div className="space-y-2">
                        <Label htmlFor="country" className="text-xs text-neutral-500">Country/Region</Label>
                        <Select value={data.country} onValueChange={(v) => updateField("country", v)}>
                            <SelectTrigger className="h-12 rounded-lg border-neutral-300">
                                <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent>
                                {COUNTRIES.map((c) => (
                                    <SelectItem key={c.code} value={c.code}>
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Name Row */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <Input
                                placeholder="First name"
                                value={data.firstName}
                                onChange={(e) => updateField("firstName", e.target.value)}
                                className="h-12 rounded-lg border-neutral-300"
                            />
                        </div>
                        <div className="space-y-2">
                            <Input
                                placeholder="Last name"
                                value={data.lastName}
                                onChange={(e) => updateField("lastName", e.target.value)}
                                className="h-12 rounded-lg border-neutral-300"
                            />
                        </div>
                    </div>

                    {/* Address */}
                    <div className="relative">
                        <Input
                            placeholder="Address"
                            value={data.address}
                            onChange={(e) => updateField("address", e.target.value)}
                            className="h-12 rounded-lg border-neutral-300 pr-10"
                        />
                        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                    </div>

                    {/* Apartment */}
                    <Input
                        placeholder="Apartment, suite, etc. (optional)"
                        value={data.apartment}
                        onChange={(e) => updateField("apartment", e.target.value)}
                        className="h-12 rounded-lg border-neutral-300"
                    />

                    {/* City Row */}
                    <div className="grid grid-cols-2 gap-3">
                        <Input
                            placeholder="Postal code"
                            value={data.postalCode}
                            onChange={(e) => updateField("postalCode", e.target.value)}
                            className="h-12 rounded-lg border-neutral-300"
                        />
                        <Input
                            placeholder="City"
                            value={data.city}
                            onChange={(e) => updateField("city", e.target.value)}
                            className="h-12 rounded-lg border-neutral-300"
                        />
                    </div>

                    {/* Phone */}
                    <div className="relative">
                        <Input
                            placeholder="Phone (optional)"
                            value={data.phone}
                            onChange={(e) => updateField("phone", e.target.value)}
                            className="h-12 rounded-lg border-neutral-300 pr-10"
                        />
                        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 16v-4M12 8h.01" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Shipping Method */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Shipping method</h2>
                <p className="text-sm text-neutral-500 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                    Enter your shipping address to view available shipping methods.
                </p>
            </div>
        </div>
    );
}
