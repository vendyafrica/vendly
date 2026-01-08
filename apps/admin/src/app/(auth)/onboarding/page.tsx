"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@vendly/ui/components/button";
import { Input } from "@vendly/ui/components/input";
import { Label } from "@vendly/ui/components/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@vendly/ui/components/card";
import { Check, ChevronRight, ChevronLeft, Store, Palette, Instagram, Rocket } from "lucide-react";

type Step = "details" | "template" | "instagram" | "review";

interface StoreData {
  name: string;
  slug: string;
  template: "fashion" | "general";
  instagramConnected: boolean;
}

const TEMPLATES = [
  {
    id: "fashion" as const,
    name: "Fashion",
    description: "Clothing, accessories, and lifestyle",
    icon: "👗",
    color: "from-pink-500 to-rose-500",
  },
  {
    id: "general" as const,
    name: "General",
    description: "Multi-category retail store",
    icon: "🛒",
    color: "from-blue-500 to-indigo-500",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  // Using window.location.search for params since useSearchParams is not imported and to keep it simple without adding more imports if possible, 
  // but better to use useSearchParams if we can add the import. 
  // Let's stick to adding the hook.

  const [currentStep, setCurrentStep] = useState<Step>("details");
  const [isLoading, setIsLoading] = useState(false);
  const [storeData, setStoreData] = useState<StoreData>({
    name: "",
    slug: "",
    template: "fashion",
    instagramConnected: false,
  });

  // Handle URL params for callbacks
  useEffect(() => {
    // Check if running on client
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const stepParam = params.get("step");
    const connectedParam = params.get("connected");

    // Recover state from storage if exists
    const storedData = sessionStorage.getItem("onboarding_data");
    let currentData = storeData;

    if (storedData) {
      try {
        currentData = JSON.parse(storedData);
        setStoreData(currentData);
      } catch (e) {
        console.error("Failed to parse stored onboarding data", e);
      }
    }

    // Handle Instagram callback
    if (stepParam === "instagram" && connectedParam === "true") {
      setCurrentStep("instagram");
      setStoreData(prev => ({
        ...prev,
        ...currentData, // Merge with stored data
        instagramConnected: true
      }));

      // Clean up URL
      window.history.replaceState({}, "", "/onboarding");
    }
  }, []);

  const steps: { id: Step; label: string; icon: React.ReactNode }[] = [
    { id: "details", label: "Store Details", icon: <Store className="w-4 h-4" /> },
    { id: "template", label: "Choose Template", icon: <Palette className="w-4 h-4" /> },
    { id: "instagram", label: "Connect Instagram", icon: <Instagram className="w-4 h-4" /> },
    { id: "review", label: "Launch", icon: <Rocket className="w-4 h-4" /> },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleNameChange = (name: string) => {
    setStoreData({
      ...storeData,
      name,
      slug: generateSlug(name),
    });
  };

  const handleConnectInstagram = async () => {
    // Redirect to Instagram OAuth
    const baseUrl = process.env.NEXT_PUBLIC_ADMIN_URL || window.location.origin;
    const callbackUrl = `${baseUrl}/onboarding?step=instagram&connected=true`;

    // Store current state in sessionStorage
    sessionStorage.setItem("onboarding_data", JSON.stringify(storeData));

    // Redirect to auth endpoint
    window.location.href = `/api/auth/signin/instagram?callbackUrl=${encodeURIComponent(callbackUrl)}`;
  };

  const handleLaunchStore = async () => {
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      // 1. Start Site Builder Job
      const startRes = await fetch(`${apiUrl}/api/site-builder/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantSlug: storeData.slug,
          input: {
            storeName: storeData.name,
            template: storeData.template,
            category: "fashion",
            colorTemplate: "dark",
          }
        }),
      });

      if (!startRes.ok) {
        throw new Error("Failed to start site builder");
      }

      const { jobId } = await startRes.json();

      // 2. Poll for completion
      const pollStatus = async () => {
        try {
          const statusRes = await fetch(`${apiUrl}/api/site-builder/status?jobId=${jobId}`);

          if (!statusRes.ok) {
            throw new Error("Failed to check status");
          }

          const statusData = await statusRes.json();

          if (statusData.status === "ready") {
            // 3. If Instagram is connected, sync products
            if (storeData.instagramConnected) {
              try {
                await fetch(`${apiUrl}/api/instagram/sync`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ storeSlug: storeData.slug }),
                });
              } catch (e) {
                console.warn("Instagram sync failed:", e);
              }
            }

            // 4. Redirect to the store dashboard or store page
            router.push(`/${storeData.slug}`);
          } else if (statusData.status === "failed") {
            console.error("Site generation failed:", statusData.error);
            setIsLoading(false);
            alert(`Failed to create store: ${statusData.error}`);
          } else {
            // Still running, poll again in 1s
            setTimeout(pollStatus, 1000);
          }
        } catch (error) {
          console.error("Polling error:", error);
          setIsLoading(false);
        }
      };

      pollStatus();

    } catch (error) {
      console.error("Error launching store:", error);
      setIsLoading(false);
      alert("Something went wrong while launching your store. Please try again.");
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case "details":
        return storeData.name.length >= 2 && storeData.slug.length >= 2;
      case "template":
        return true;
      case "instagram":
        return true;
      case "review":
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id);
    }
  };

  const prevStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <span className="font-serif italic text-xl font-medium text-slate-800">
            Vendly
          </span>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-2 md:gap-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all
                    ${currentStepIndex === index
                      ? "bg-slate-900 text-white"
                      : currentStepIndex > index
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-400"
                    }
                  `}
                >
                  {currentStepIndex > index ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    step.icon
                  )}
                  <span className="hidden md:inline">{step.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-slate-300 mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
        <Card className="w-full max-w-lg shadow-xl border-0">
          {/* Step 1: Store Details */}
          {currentStep === "details" && (
            <>
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                  <Store className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Create Your Store</CardTitle>
                <CardDescription>
                  Give your store a name and we'll create a unique URL for you.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    placeholder="My Fashion Store"
                    value={storeData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="h-12 text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeSlug">Store URL</Label>
                  <div className="flex items-center border rounded-lg bg-slate-50 overflow-hidden">
                    <span className="px-4 text-sm text-slate-500 bg-slate-100 h-12 flex items-center border-r">
                      vendly.store/
                    </span>
                    <Input
                      id="storeSlug"
                      value={storeData.slug}
                      onChange={(e) =>
                        setStoreData({ ...storeData, slug: e.target.value })
                      }
                      className="border-0 h-12 focus-visible:ring-0"
                      placeholder="my-store"
                    />
                  </div>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 2: Choose Template */}
          {currentStep === "template" && (
            <>
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                  <Palette className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Choose Your Style</CardTitle>
                <CardDescription>
                  Select a template that fits your brand.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid gap-4">
                  {TEMPLATES.map((template) => (
                    <button
                      key={template.id}
                      onClick={() =>
                        setStoreData({ ...storeData, template: template.id })
                      }
                      className={`
                        relative p-6 rounded-xl border-2 text-left transition-all
                        ${storeData.template === template.id
                          ? "border-slate-900 bg-slate-50"
                          : "border-slate-200 hover:border-slate-300"
                        }
                      `}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`
                            w-14 h-14 rounded-xl bg-gradient-to-br ${template.color}
                            flex items-center justify-center text-2xl
                          `}
                        >
                          {template.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            {template.name}
                          </h3>
                          <p className="text-sm text-slate-500">
                            {template.description}
                          </p>
                        </div>
                        {storeData.template === template.id && (
                          <div className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </>
          )}

          {/* Step 3: Connect Instagram */}
          {currentStep === "instagram" && (
            <>
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center">
                  <Instagram className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Import Your Products</CardTitle>
                <CardDescription>
                  Connect Instagram to automatically import your posts as products.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-6">
                {storeData.instagramConnected ? (
                  <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Check className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h3 className="font-medium text-emerald-800">
                      Instagram Connected!
                    </h3>
                    <p className="text-sm text-emerald-600 mt-1">
                      Your posts will be imported when you launch.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-center">
                      <p className="text-sm text-slate-600 mb-4">
                        We'll import your Instagram photos as product images.
                        You can set prices later.
                      </p>
                      <Button
                        size="lg"
                        className="gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:opacity-90"
                        onClick={handleConnectInstagram}
                      >
                        <Instagram className="w-5 h-5" />
                        Connect Instagram
                      </Button>
                    </div>
                    <p className="text-xs text-center text-slate-400">
                      You can skip this step and add products manually later.
                    </p>
                  </>
                )}
              </CardContent>
            </>
          )}

          {/* Step 4: Review & Launch */}
          {currentStep === "review" && (
            <>
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Ready to Launch!</CardTitle>
                <CardDescription>
                  Review your settings and launch your store.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="p-4 rounded-lg bg-slate-50 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-500">Store Name</span>
                    <span className="font-medium">{storeData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-500">URL</span>
                    <span className="font-mono text-sm">
                      vendly.store/{storeData.slug}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-500">Template</span>
                    <span className="font-medium capitalize">
                      {storeData.template}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-500">Instagram</span>
                    <span
                      className={
                        storeData.instagramConnected
                          ? "text-emerald-600"
                          : "text-slate-400"
                      }
                    >
                      {storeData.instagramConnected ? "Connected" : "Not connected"}
                    </span>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full h-14 text-lg gap-2"
                  onClick={handleLaunchStore}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating your store...
                    </>
                  ) : (
                    <>
                      <Rocket className="w-5 h-5" />
                      Launch My Store
                    </>
                  )}
                </Button>
              </CardContent>
            </>
          )}

          {/* Navigation */}
          <div className="px-6 pb-6 pt-4 flex justify-between">
            {currentStepIndex > 0 ? (
              <Button variant="ghost" onClick={prevStep}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            ) : (
              <div />
            )}

            {currentStep !== "review" && (
              <Button onClick={nextStep} disabled={!canProceed()}>
                {currentStep === "instagram" ? "Skip" : "Continue"}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
}