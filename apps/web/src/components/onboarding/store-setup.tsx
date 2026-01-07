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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@vendly/ui/components/select";
import { useOnboarding } from '@/contexts/OnboardingContext';
import { THEME_PRESETS, getThemeById } from '@/lib/theme-presets';

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
  const [storeName, setStoreName] = useState(data.storeName);
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

      const res = await fetch(`${apiBaseUrl}/api/site-builder/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantSlug: subdomain,
          input: {
            storeName: storeName.trim(),
            category: data.categories.join(', '),
            themeId: selectedThemeId,
          },
        }),
        cache: 'no-store',
      });

      if (!res.ok) {
        const message = await res.text();
        throw new Error(message || 'Failed to start storefront generation');
      }

      const result = (await res.json()) as { jobId?: string };
      if (!result.jobId) {
        throw new Error('Missing jobId from API');
      }

      updateData({
        storeName: storeName.trim(),
        subdomain,
        selectedThemeId,
        colorPalette: theme?.name || '',
        jobId: result.jobId,
      });

      router.push(`/sell/success?jobId=${result.jobId}&subdomain=${subdomain}`);
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
