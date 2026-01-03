"use client";

import { useState, useEffect } from "react";
import { Button } from "@vendly/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@vendly/ui/components/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle02Icon, MailIcon, StoreIcon, ArrowRightIcon } from "@hugeicons/core-free-icons";

export default function SuccessPage() {
  const [countdown, setCountdown] = useState(10);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const sendMagicLink = () => {
    // TODO: Send magic link to seller's email
    setMagicLinkSent(true);
    // TODO: Redirect to admin dashboard after delay
    setTimeout(() => {
      window.location.href = "/admin/dashboard";
    }, 3000);
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (!magicLinkSent) {
      // Defer the setState call to avoid cascading renders
      const timeoutId = setTimeout(sendMagicLink, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [countdown, magicLinkSent]);

  const handleGoToDashboard = () => {
    window.location.href = "/admin/dashboard";
  };

  return (
    <div className="space-y-8">
      {/* Success Animation */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <HugeiconsIcon 
              icon={CheckmarkCircle02Icon} 
              size={40} 
              className="text-green-600"
            />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-green-600">
          Your Store is Ready!
        </h1>
        <p className="text-muted-foreground text-lg">
          Welcome to Vendly! Your ecommerce store has been created successfully.
        </p>
      </div>

      {/* Progress Complete */}
      <div className="flex items-center justify-center space-x-2">
        <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
          ✓
        </div>
        <div className="w-16 h-1 bg-green-600"></div>
        <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
          ✓
        </div>
        <div className="w-16 h-1 bg-green-600"></div>
        <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
          ✓
        </div>
        <div className="w-16 h-1 bg-green-600"></div>
        <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
          ✓
        </div>
      </div>

      {/* What's Next */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HugeiconsIcon icon={StoreIcon} size={20} />
            <span>What&apos;s Next?</span>
          </CardTitle>
          <CardDescription>
            Your store is now live and ready for business
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
              1
            </div>
            <div>
              <h4 className="font-medium">Check your email</h4>
              <p className="text-sm text-muted-foreground">
                We&apos;ve sent a magic link to sign in to your dashboard
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
              2
            </div>
            <div>
              <h4 className="font-medium">Add your products</h4>
              <p className="text-sm text-muted-foreground">
                Start adding products to your new store
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
              3
            </div>
            <div>
              <h4 className="font-medium">Customize your store</h4>
              <p className="text-sm text-muted-foreground">
                Fine-tune your design and settings
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Magic Link Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HugeiconsIcon icon={MailIcon} size={20} />
            <span>Magic Link</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!magicLinkSent ? (
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                Sending magic link to your email in...
              </p>
              <div className="text-4xl font-bold text-primary">
                {countdown}
              </div>
              <Button 
                variant="outline" 
                onClick={sendMagicLink}
                disabled={countdown > 0}
              >
                Send Now
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={24} className="text-green-600" />
              </div>
              <p className="text-green-600 font-medium">
                Magic link sent successfully!
              </p>
              <p className="text-sm text-muted-foreground">
                Check your email and click the link to access your dashboard.
              </p>
              <p className="text-xs text-muted-foreground">
                Redirecting to dashboard in a few seconds...
              </p>
              <Button onClick={handleGoToDashboard} className="w-full">
                Go to Dashboard Now
                <HugeiconsIcon icon={ArrowRightIcon} size={16} className="ml-2" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="text-center space-y-4">
        <p className="text-sm text-muted-foreground">
          Need help? Check out our <a href="#" className="text-primary hover:underline">Seller Guide</a> or <a href="#" className="text-primary hover:underline">Contact Support</a>
        </p>
      </div>
    </div>
  );
}
