"use client";

import { Button } from "@vendly/ui/components/button";
import { useOnboarding } from "../context/onboarding-context";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon } from "@hugeicons/core-free-icons";

export function Step0Pricing() {
    const { navigateToStep } = useOnboarding();

    const handleContinue = () => {
        navigateToStep("step1");
    };

    const freeFeatures = [
        "Instant digital storefront",
        "Unlimited products & categories",
        "Direct WhatsApp ordering integration",
        "Mobile-first management dashboard",
        "Zero transaction fees (for now)"
    ];

    const proFeatures = [
        "Custom domain support",
        "Advanced store analytics",
        "Access to creator monetization",
        "Custom store branding",
        "Delivery coordination"
    ];

    return (
        <div className="flex flex-col md:flex-row items-stretch justify-center w-full gap-6">
            {/* Free Tier */}
            <div className="flex w-full max-w-sm flex-col rounded-2xl border bg-card text-card-foreground p-8 shadow-sm">
                <div className="text-center space-y-2 mb-6">
                    <div className="inline-flex items-center justify-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-2">
                        Limited Time Offer
                    </div>
                    <h2 className="text-2xl font-semibold text-pretty">
                        Start for Free
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Create your Vendly store today and get full access at no cost.
                    </p>
                </div>

                <div className="flex justify-center mb-6">
                    <span className="text-lg font-semibold mt-1">$</span>
                    <span className="text-6xl font-semibold tracking-tighter">0</span>
                    <span className="self-end text-muted-foreground mb-2 ml-1">/mo</span>
                </div>

                <div className="my-6 space-y-4 flex-1">
                    <ul className="flex flex-col gap-3.5">
                        {freeFeatures.map((feature, i) => (
                            <li
                                key={i}
                                className="flex items-start gap-3 text-sm font-medium"
                            >
                                <div className="mt-0.5 rounded-full bg-primary/20 p-1 shrink-0">
                                    <HugeiconsIcon icon={Tick02Icon} className="h-3 w-3 text-primary" strokeWidth={2.5} />
                                </div>
                                <span className="leading-snug">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <Button
                    type="button"
                    variant="default"
                    size="lg"
                    onClick={handleContinue}
                    className="w-full mt-2"
                >
                    Get Started — It's Free
                </Button>
            </div>

            {/* Pro Tier (Coming Soon) */}
            <div className="relative flex w-full max-w-sm flex-col rounded-2xl border border-border/50 bg-card/50 text-card-foreground p-8 shadow-sm">
                <div className="text-center space-y-2 mb-6">
                    <div className="inline-flex items-center justify-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground mb-2">
                        Pro Tier
                    </div>
                    <h2 className="text-2xl font-semibold text-pretty">
                        Grow
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Take your business to the next level with advanced features.
                    </p>
                </div>

                <div className="flex justify-center mb-6">
                    <span className="text-lg font-semibold mt-1">$</span>
                    <span className="text-6xl font-semibold tracking-tighter">25</span>
                    <span className="self-end text-muted-foreground mb-2 ml-1">/mo</span>
                </div>

                <div className="my-6 space-y-4 flex-1">
                    <ul className="flex flex-col gap-3.5">
                        {proFeatures.map((feature, i) => (
                            <li
                                key={i}
                                className="flex flex-col gap-1 items-start text-sm font-medium opacity-80"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 rounded-full bg-muted-foreground/20 p-1 shrink-0">
                                        <HugeiconsIcon icon={Tick02Icon} className="h-3 w-3 text-muted-foreground" strokeWidth={2.5} />
                                    </div>
                                    <span className="leading-snug flex flex-wrap items-center gap-2">
                                        {feature}
                                        <span className="text-[10px] uppercase font-bold tracking-wider rounded-md bg-primary/20 text-primary px-1.5 py-0.5 whitespace-nowrap">
                                            Coming Soon
                                        </span>
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    disabled
                    className="w-full mt-2 opacity-80"
                >
                    Coming Soon
                </Button>
            </div>
        </div>
    );
}
