"use client";

import { useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { InstagramIcon, NewTwitterIcon, Facebook01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@vendly/ui/components/button";
import { StoreFooterConfig } from "../../../types/store-config";
import { cn, themeClasses, animations } from "../../../lib/theme-utils";

interface StorefrontFooterProps {
    config: StoreFooterConfig;
}

export function StorefrontFooter({ config }: StorefrontFooterProps) {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        setSubscribed(true);
        setEmail("");
    };

    return (
        <footer className={cn("pt-12 pb-7 border-t", themeClasses.background.card, themeClasses.border.default)}>
            <div className="max-w-7xl mx-auto px-6">
                {/* Main footer content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Store info */}
                    <div>
                        <h3 className={cn("text-base font-medium mb-2", themeClasses.text.primary)}>{config?.copyrightText?.split(".")?.[0] ?? "vendly"}</h3>
                        <p className={cn("text-sm leading-relaxed", themeClasses.text.muted)}>
                            Curated collection of premium products.
                        </p>
                    </div>

                    {/* Quick links */}
                    <div>
                        <h4 className={cn("text-sm font-medium uppercase tracking-wider mb-4", themeClasses.text.muted)}>
                            Shop
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="#products"
                                    className={cn("text-sm transition-colors", themeClasses.text.default, themeClasses.hover.accent, animations.transition)}
                                >
                                    All Products
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className={cn("text-sm transition-colors", themeClasses.text.default, themeClasses.hover.accent, animations.transition)}
                                >
                                    New Arrivals
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className={cn("text-sm transition-colors", themeClasses.text.default, themeClasses.hover.accent, animations.transition)}
                                >
                                    Best Sellers
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className={cn("text-sm font-medium uppercase tracking-wider mb-4", themeClasses.text.muted)}>
                            Support
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="#"
                                    className={cn("text-sm transition-colors", themeClasses.text.default, themeClasses.hover.accent, animations.transition)}
                                >
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className={cn("text-sm transition-colors", themeClasses.text.default, themeClasses.hover.accent, animations.transition)}
                                >
                                    Shipping
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className={cn("text-sm transition-colors", themeClasses.text.default, themeClasses.hover.accent, animations.transition)}
                                >
                                    Returns
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className={cn("text-sm font-medium uppercase tracking-wider mb-4", themeClasses.text.muted)}>
                            Store Updates
                        </h4>
                        {subscribed ? (
                            <p className={cn("text-sm", themeClasses.text.default)}>
                                Thanks for subscribing!
                            </p>
                        ) : (
                            <form onSubmit={handleSubscribe} className="space-y-3">
                                <input
                                    type="number"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Your phone number"
                                    required
                                    className={cn("w-full px-4 py-3 text-sm rounded", themeClasses.border.default, themeClasses.background.card, themeClasses.text.default, animations.transition, themeClasses.focus.ring)}
                                />
                                <Button
                                    type="submit"
                                    className={cn("w-full h-11 text-sm font-medium", themeClasses.button.default)}
                                >
                                    Subscribe
                                </Button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Social links */}
                <div className="flex justify-center gap-6 mb-8">
                    <a
                        href="#"
                        className={cn(themeClasses.text.muted, themeClasses.hover.primary, animations.transition)}
                        aria-label="Instagram"
                    >
                        <HugeiconsIcon icon={InstagramIcon} size={20} />
                    </a>
                    <a
                        href="#"
                        className={cn(themeClasses.text.muted, themeClasses.hover.primary, animations.transition)}
                        aria-label="Twitter"
                    >
                        <HugeiconsIcon icon={NewTwitterIcon} size={20} />
                    </a>
                    <a
                        href="#"
                        className={cn(themeClasses.text.muted, themeClasses.hover.primary, animations.transition)}
                        aria-label="Facebook"
                    >
                        <HugeiconsIcon icon={Facebook01Icon} size={20} />
                    </a>
                </div>

                {/* Bottom bar */}
                <div className="pt-8 text-center">
                    <p className={cn("text-xs", themeClasses.text.muted)}>
                        Powered by{" "}
                        <Link
                            href="https://vendlyafrica.store"
                            className={cn("font-medium", themeClasses.text.default, themeClasses.hover.primary, animations.transition)}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Vendly
                        </Link>
                    </p>
                </div>
            </div>
        </footer>
    );
}
