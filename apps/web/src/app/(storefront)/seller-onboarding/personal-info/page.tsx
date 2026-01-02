"use client";

import { useState } from "react";
import { Button } from "@vendly/ui/components/button";
import { Input } from "@vendly/ui/components/input";
import { Label } from "@vendly/ui/components/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@vendly/ui/components/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeftIcon, ArrowRightIcon } from "@hugeicons/core-free-icons";

export default function PersonalInfoPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save data and redirect to payment-setup
    window.location.href = "/seller-onboarding/payment-setup";
  };

  const handleBack = () => {
    window.location.href = "/seller-onboarding/business-info";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Your personal information</h1>
        <p className="text-muted-foreground">
          We need this to set up your account and process payments
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-center space-x-2">
        <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-sm font-medium">
          ✓
        </div>
        <div className="w-16 h-1 bg-primary"></div>
        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
          2
        </div>
        <div className="w-16 h-1 bg-muted"></div>
        <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-sm font-medium">
          3
        </div>
        <div className="w-16 h-1 bg-muted"></div>
        <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-sm font-medium">
          4
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Details</CardTitle>
          <CardDescription>
            This information will be used for your account setup
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                We&apos;ll use this for account notifications and payment confirmations
              </p>
            </div>

            {/* Navigation */}
            <div className="flex gap-4 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleBack}
                className="flex-1"
              >
                <HugeiconsIcon icon={ArrowLeftIcon} size={16} className="mr-2" />
                Back
              </Button>
              <Button 
                type="submit" 
                className="flex-1" 
                size="lg"
                disabled={!name || !phone || !email}
              >
                Continue to Payment Setup
                <HugeiconsIcon icon={ArrowRightIcon} size={16} className="ml-2" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
