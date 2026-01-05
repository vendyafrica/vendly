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

export function PersonalForm() {
  const router = useRouter();
  const { data, updateData } = useOnboarding();
  const [fullName, setFullName] = useState(data.fullName);
  const [phone, setPhone] = useState(data.phone);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) return;
    updateData({ fullName: fullName.trim(), phone: phone.trim() });
    router.push('/sell/business');
  };

  return (
    <Card className="w-full max-w-4xl rounded-2xl py-10 gap-10">
      <CardHeader className="px-10">
        <CardTitle className="text-xl">Personal details</CardTitle>
        <CardDescription>
          Tell us a bit about yourself to get started.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-10">
        <form id="personal-form" onSubmit={handleSubmit}>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Smith"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Phone number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="0712345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>
        </form>
      </CardContent>

      <CardFooter className="px-10 justify-end">
        <Button type="submit" form="personal-form" className="px-8">
          Continue
        </Button>
      </CardFooter>
    </Card>
  );
}
