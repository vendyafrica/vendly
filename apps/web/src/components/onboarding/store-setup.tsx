'use client';

import { useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';
import { Button } from "@vendly/ui/components/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@vendly/ui/components/card";
import { Input } from "@vendly/ui/components/input";
import { Label } from "@vendly/ui/components/label";
import { Textarea } from "@vendly/ui/components/textarea";
import { useOnboarding } from '../../contexts/onboarding-context';
import { useOnboardingSubmit } from '../../hooks/use-onboarding-submit';
import { validateStoreStep } from '../../utils/validators';
import { sanitizeSubdomain, buildStoreUrl } from '../../utils/transformers';

export const StoreStep = () => {
    const router = useRouter();
    const { data, updateData } = useOnboarding();
    const { submit, isSubmitting, error } = useOnboardingSubmit();

    const [storeName, setStoreName] = useState(data.storeName);
    const [description, setDescription] = useState(data.description || "");
    const [errors, setErrors] = useState<string[]>([]);

    const tenantSlug = useMemo(() => {
        const base = storeName || data.tenantSlug || '';
        return sanitizeSubdomain(base);
    }, [storeName, data.tenantSlug]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validation = validateStoreStep({ storeName, tenantSlug });

        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        // Update local state
        updateData({
            storeName: storeName.trim(),
            description: description.trim(),
            tenantSlug,
        });

        // Submit to API
        const response = await submit({
            ...data,
            storeName: storeName.trim(),
            description: description.trim(),
            tenantSlug,
        });

        if (response?.adminUrl) {
            // Redirect to admin
            window.location.href = response.adminUrl;
        }
    };

    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'vendlyafrica.store';
    const storeUrl = tenantSlug ? buildStoreUrl(sanitizeSubdomain(tenantSlug), rootDomain) : '';

    return (
        <Card className="w-full max-w-4xl rounded-2xl py-10 gap-8">
            <CardHeader className="px-10">
                <CardTitle className="text-xl">Store Setup</CardTitle>
                <CardDescription>Set up your storefront</CardDescription>
            </CardHeader>

            <CardContent className="px-10">
                <form id="store-setup-form" onSubmit={handleSubmit}>
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="storeName">Store Name</Label>
                            <Input
                                id="storeName"
                                type="text"
                                placeholder="My Store"
                                value={storeName}
                                onChange={(e) => setStoreName(e.target.value)}
                                required
                            />
                            {storeUrl && (
                                <p className="text-sm text-muted-foreground">
                                    Your store URL: <span className="font-medium">{storeUrl}</span>
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Store Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Describe your store..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </div>

                    {(errors.length > 0 || error) && (
                        <div className="mt-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                            {errors.map((err, i) => (
                                <p key={i}>{err}</p>
                            ))}
                            {error && <p>{error}</p>}
                        </div>
                    )}
                </form>
            </CardContent>

            <CardFooter className="px-10 justify-end">
                <Button
                    type="submit"
                    form="store-setup-form"
                    className="px-8"
                    disabled={isSubmitting || !storeName.trim()}
                >
                    {isSubmitting ? 'Creating...' : 'Create Store'}
                </Button>
            </CardFooter>
        </Card>
    );
};