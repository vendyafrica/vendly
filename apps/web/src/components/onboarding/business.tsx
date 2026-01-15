'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@vendly/ui/components/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@vendly/ui/components/card";
import { Label } from "@vendly/ui/components/label";
import { Input } from "@vendly/ui/components/input";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import { useOnboarding } from '../../contexts/onboarding-context';
import { validateBusinessStep } from '../../utils/validators';

const CATEGORIES = [
    "Men", "Women", "Home & Living", "Beauty & Health",
    "Gifts", "Accessories", "Food & Beverages", "Electronics",
];

const BUSINESS_TYPES = [
    { value: 'online' as const, label: 'Online Store', description: 'Sell products online through your website' },
    { value: 'in-person' as const, label: 'In-Person Sales', description: 'Sell at physical locations, markets, or events' },
];

export const BusinessStep = () => {
    const router = useRouter();
    const { data, updateData } = useOnboarding();
    const [businessType, setBusinessType] = useState<('online' | 'in-person')[]>(data.businessType || []);
    const [categories, setCategories] = useState<string[]>(data.categories);
    const [location, setLocation] = useState(data.location || "");
    const [errors, setErrors] = useState<string[]>([]);

    const toggleBusinessType = (type: 'online' | 'in-person') => {
        setBusinessType((prev) =>
            prev.includes(type)
                ? prev.filter((t) => t !== type)
                : [...prev, type]
        );
    };

    const toggleCategory = (category: string) => {
        setCategories((prev) =>
            prev.includes(category)
                ? prev.filter((c) => c !== category)
                : [...prev, category]
        );
    };

    const handleContinue = () => {
        const validation = validateBusinessStep({ categories, businessType });
        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        updateData({ businessType, categories, location });
        router.push('/sell/store-setup');
    };

    return (
        <Card className="w-full max-w-4xl rounded-2xl p-6 md:p-8 gap-6 shadow-sm">
            <CardHeader className="p-0 mb-6 space-y-1">
                <CardTitle className="text-xl">Business Information</CardTitle>
                <CardDescription>
                    Tell us about your business to get started
                </CardDescription>
            </CardHeader>

            <CardContent className="p-0">
                <div className="space-y-8">
                    {/* Business Type */}
                    <div className="space-y-3">
                        <Label className="font-medium">How do you sell?</Label>
                        <p className="text-sm text-muted-foreground">Select all that apply</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {BUSINESS_TYPES.map((type) => (
                                <div
                                    key={type.value}
                                    className={`
                                        flex items-start space-x-3 p-4 rounded-lg border transition-all cursor-pointer hover:bg-muted/50
                                        ${businessType.includes(type.value) ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-input'}
                                    `}
                                    onClick={() => toggleBusinessType(type.value)}
                                >
                                    <Checkbox.Root
                                        id={type.value}
                                        checked={businessType.includes(type.value)}
                                        onCheckedChange={() => toggleBusinessType(type.value)}
                                        className={`
                                            h-5 w-5 rounded border border-primary/20 flex items-center justify-center transition-colors mt-0.5
                                            data-[state=checked]:bg-primary data-[state=checked]:border-primary
                                        `}
                                    >
                                        <Checkbox.Indicator className="text-white">
                                            <CheckIcon className="h-3.5 w-3.5" />
                                        </Checkbox.Indicator>
                                    </Checkbox.Root>
                                    <div className="flex-1">
                                        <Label htmlFor={type.value} className="text-sm font-medium cursor-pointer">
                                            {type.label}
                                        </Label>
                                        <p className="text-xs text-muted-foreground mt-1">{type.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Product Categories */}
                    <div className="space-y-3 pt-6 border-t">
                        <Label className="font-medium">Product Categories</Label>
                        <p className="text-sm text-muted-foreground">What do you sell?</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {CATEGORIES.map((category) => (
                                <div
                                    key={category}
                                    className={`
                                        flex items-center space-x-2 p-3 rounded-lg border transition-all cursor-pointer hover:bg-muted/50
                                        ${categories.includes(category) ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-input'}
                                    `}
                                    onClick={() => toggleCategory(category)}
                                >
                                    <Checkbox.Root
                                        id={category}
                                        checked={categories.includes(category)}
                                        onCheckedChange={() => toggleCategory(category)}
                                        className={`
                                            h-5 w-5 rounded border border-primary/20 flex items-center justify-center transition-colors
                                            data-[state=checked]:bg-primary data-[state=checked]:border-primary
                                        `}
                                    >
                                        <Checkbox.Indicator className="text-white">
                                            <CheckIcon className="h-3.5 w-3.5" />
                                        </Checkbox.Indicator>
                                    </Checkbox.Root>
                                    <Label htmlFor={category} className="text-sm font-normal leading-none cursor-pointer flex-1">
                                        {category}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Business Location */}
                    <div className="space-y-3 pt-6 border-t">
                        <Label htmlFor="location">Business Location</Label>
                        <Input
                            id="location"
                            placeholder="e.g., Nairobi, Kenya"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>

                    {errors.length > 0 && (
                        <div className="mt-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                            {errors.map((error, i) => (
                                <p key={i}>{error}</p>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>

            <CardFooter className="p-0 mt-8 flex justify-end">
                <Button
                    onClick={handleContinue}
                    size="lg"
                    className="w-full md:w-auto px-8"
                    disabled={businessType.length === 0 || categories.length === 0}
                >
                    Continue
                </Button>
            </CardFooter>
        </Card>
    );
};
