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
import { Label } from "@vendly/ui/components/label";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import { useOnboarding } from '@/contexts/OnboardingContext';

const CATEGORIES = [
  "Fashion",
  "Beauty",
  "Home & Living",
  "Electronics",
  "Sports",
  "Books",
  "Toys",
  "Food",
  "Health",
];

export function BusinessForm() {
  const router = useRouter();
  const { data, updateData } = useOnboarding();
  const [categories, setCategories] = useState<string[]>(data.categories);

  const toggleCategory = (category: string) => {
    setCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (categories.length === 0) return;
    updateData({ categories });
    router.push('/sell/store-setup');
  };

  return (
    <Card className="w-full max-w-4xl rounded-2xl py-10 gap-10">
      <CardHeader className="px-10">
        <CardTitle className="text-xl">Business Information</CardTitle>
        <CardDescription>
          Tell us about your business
        </CardDescription>
      </CardHeader>

      <CardContent className="px-10">
        <form id="business-form" onSubmit={handleSubmit}>
          <div className="space-y-4 mt-6">
            <Label>Product Categories</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {CATEGORIES.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox.Root
                    id={category}
                    checked={categories.includes(category)}
                    onCheckedChange={() => toggleCategory(category)}
                    className="h-4 w-4 rounded border border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  >
                    <Checkbox.Indicator className="flex items-center justify-center text-white">
                      <CheckIcon className="h-3 w-3" />
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                  <label
                    htmlFor={category}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    onClick={() => toggleCategory(category)}
                  >
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </form>
      </CardContent>

      <CardFooter className="px-10 justify-end">
        <Button
          type="submit"
          form="business-form"
          className="px-8"
          disabled={categories.length === 0}
        >
          Continue
        </Button>
      </CardFooter>
    </Card>
  );
}
