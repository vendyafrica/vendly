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
import { useOnboarding } from '@/contexts/OnboardingContext';

const COLOR_PALETTES = [
  { name: "Ocean Blue", colors: ["#0077B6", "#00B4D8", "#90E0EF", "#CAF0F8"] },
  { name: "Sunset Orange", colors: ["#FF6B35", "#F77F00", "#FCBF49", "#EAE2B7"] },
  { name: "Forest Green", colors: ["#2D6A4F", "#52B788", "#95D5B2", "#D8F3DC"] },
  { name: "Royal Purple", colors: ["#7209B7", "#A663CC", "#C77DFF", "#E0AAFF"] },
];

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
  const [subdomain, setSubdomain] = useState(data.subdomain);
  const [colorPalette, setColorPalette] = useState(data.colorPalette || COLOR_PALETTES[0].name);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubdomainChange = (value: string) => {
    setSubdomain(sanitizeSubdomain(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim() || !subdomain.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';
      const selectedPalette = COLOR_PALETTES.find((p) => p.name === colorPalette);

      const res = await fetch(`${apiBaseUrl}/api/site-builder/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantSlug: subdomain,
          input: {
            storeName: storeName.trim(),
            category: data.categories.join(', '),
            brandVibe: colorPalette,
            colors: selectedPalette?.colors.join(', ') ?? '',
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
        colorPalette,
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
    <Card className="w-full max-w-4xl rounded-2xl py-10 gap-10">
      <CardHeader className="px-10">
        <CardTitle className="text-xl">Store Setup</CardTitle>
        <CardDescription>
          Set up your storefront
        </CardDescription>
      </CardHeader>

      <CardContent className="px-10">
        <form id="store-setup-form" onSubmit={handleSubmit}>
          <div className="grid gap-6 md:grid-cols-2">
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
            </div>
            <div className="grid gap-2">
              <Label htmlFor="storeSlug">Store URL</Label>
              <div className="flex items-center">
                <Input
                  id="storeSlug"
                  type="text"
                  placeholder="my-store"
                  value={subdomain}
                  onChange={(e) => handleSubdomainChange(e.target.value)}
                  className="rounded-r-none"
                  required
                />
                <span className="inline-flex items-center px-3 h-9 border border-l-0 border-input bg-muted text-muted-foreground text-sm rounded-r-md">
                  .{rootDomain}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4 mt-8">
            <Label>Color Palette</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {COLOR_PALETTES.map((palette) => (
                <button
                  key={palette.name}
                  type="button"
                  onClick={() => setColorPalette(palette.name)}
                  className="flex items-center space-x-2 cursor-pointer group text-left"
                >
                  <div
                    className={`h-4 w-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                      colorPalette === palette.name
                        ? 'border-primary bg-primary'
                        : 'border-gray-300 group-hover:border-gray-400'
                    }`}
                  >
                    {colorPalette === palette.name && (
                      <div className="h-1.5 w-1.5 rounded-full bg-white" />
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      {palette.colors.map((color, index) => (
                        <div
                          key={index}
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{palette.name}</span>
                  </div>
                </button>
              ))}
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
          disabled={isSubmitting || !storeName.trim() || !subdomain.trim()}
        >
          {isSubmitting ? 'Creating...' : 'Create Store'}
        </Button>
      </CardFooter>
    </Card>
  );
}
