'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@vendly/ui/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@vendly/ui/components/card";
import { Input } from "@vendly/ui/components/input";
import { Label } from "@vendly/ui/components/label";
import { Textarea } from "@vendly/ui/components/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@vendly/ui/components/select";
import { useOnboarding } from '@/contexts/OnboardingContext';
import { THEME_PRESETS, getThemeById } from '@/lib/theme-presets';
import { useSession } from "@/lib/auth";

function sanitizeSubdomain(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/^-+|-+$/g, '');
}

export function StoreSetupForm() {
  const router = useRouter();
  const { data, updateData } = useOnboarding();
  // We can get Auth data here or in the API. 
  // API handles user update, but frontend passes the new details.
  const { data: session } = useSession(); // To get token effectively

  const [storeName, setStoreName] = useState(data.storeName);
  const [description, setDescription] = useState("");
  const [selectedThemeId, setSelectedThemeId] = useState(data.selectedThemeId || 'premium-minimal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedTheme = getThemeById(selectedThemeId);

  const handleStoreNameChange = (value: string) => {
    setStoreName(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';
      const subdomain = sanitizeSubdomain(storeName);
      const theme = getThemeById(selectedThemeId);

      // Construct payload with all onboarding data
      const payload = {
        fullName: data.fullName,
        phone: data.phone,
        categories: data.categories,
        storeName: storeName.trim(),
        description: description.trim(),
        tenantSlug: subdomain,
        themeId: selectedThemeId,
        socialLinks: data.socialLinks,
        location: data.location,
      };

      const res = await fetch(`${apiBaseUrl}/api/onboarding/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
        cache: 'no-store',
      });

      if (!res.ok) {
        const message = await res.text();
        throw new Error(message || 'Failed to complete onboarding');
      }

      const result = (await res.json());

      // Success! Update local state and redirect to Admin
      updateData({
        storeName: storeName.trim(),
        subdomain,
        selectedThemeId,
        colorPalette: theme?.name || '',
        jobId: result.jobId, // May not have job ID if sync
      });

      // Redirect to Admin Panel Store Preview
      // We assume the admin URL is returned or we construct it
      const adminUrl = result.adminUrl || `http://${subdomain}.localhost:3000`; // Default fallback

      // For now, redirect to success page which then redirects or linked to admin
      // Or redirect directly? User asked: "move them on finish onboarding for now ... and then we take them to the admin panel"
      // Let's redirect to success page first to show a "Store Created" state, then go to Admin.
      // But the success page currently expects a jobId. Since we are doing it sync (mostly), let's just push to adminUrl if available.

      if (result.adminUrl) {
        window.location.href = result.adminUrl;
      } else {
        router.push(`/sell/success?subdomain=${subdomain}`);
      }

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setError(message);
      setIsSubmitting(false);
    }
  };

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'vendlyafrica.store';

  return (
    <Card className="w-full max-w-4xl rounded-2xl py-10 gap-8">
      <CardHeader className="px-10">
        <CardTitle className="text-xl">Store Setup</CardTitle>
        <CardDescription>
          Set up your storefront
        </CardDescription>
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
                onChange={(e) => handleStoreNameChange(e.target.value)}
                required
              />
              {storeName.trim() && (
                <p className="text-sm text-muted-foreground">
                  Your store URL: <span className="font-medium">{sanitizeSubdomain(storeName)}.{rootDomain}</span>
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Store Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your store (e.g., Luxury clothes for men)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="theme">Store Theme</Label>
              <Select value={selectedThemeId} onValueChange={(value) => value && setSelectedThemeId(value)}>
                <SelectTrigger id="theme" className="w-full">
                  <div className="flex items-center gap-3">
                    {selectedTheme && (
                      <div className="flex gap-1">
                        {selectedTheme.preview.map((color, i) => (
                          <div
                            key={i}
                            className="w-3 h-3 rounded-full border border-border"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    )}
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {THEME_PRESETS.map((theme) => (
                    <SelectItem key={theme.id} value={theme.id}>
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          {theme.preview.map((color, i) => (
                            <div
                              key={i}
                              className="w-3 h-3 rounded-full border border-border"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium">{theme.name}</span>
                          <span className="text-xs text-muted-foreground">{theme.description}</span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              {error}
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
}
