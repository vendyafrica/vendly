"use client";

import { useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { InstagramIcon, NewTwitterIcon, Facebook01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@vendly/ui/components/button";

interface StorefrontFooterProps {
    store: {
        name: string;
        description: string | null;
        slug: string;
    };
}

export function StorefrontFooter({ store }: StorefrontFooterProps) {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        setSubscribed(true);
        setPhoneNumber("");
    };

    const storeName = store.name ?? "Store";
    const storeDescription = store.description ?? "Curated collections.";

    return (
        <footer className="pt-12 pb-7 border-t border-border bg-background">
            <div className="max-w-7xl mx-auto px-6">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    <div>
                        <h3 className="text-base font-medium mb-2 text-foreground">{storeName}</h3>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                            {storeDescription}
                        </p>
                    </div>


                    <div>
                        <h4 className="text-sm font-medium uppercase tracking-wider mb-4 text-muted-foreground">
                            Shop
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="#products"
                                    className="text-sm transition-colors duration-200 text-foreground hover:text-muted-foreground"
                                >
                                    All Products
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm transition-colors duration-200 text-foreground hover:text-muted-foreground"
                                >
                                    New Arrivals
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm transition-colors duration-200 text-foreground hover:text-muted-foreground"
                                >
                                    Best Sellers
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-sm font-medium uppercase tracking-wider mb-4 text-muted-foreground">
                            Support
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm transition-colors duration-200 text-foreground hover:text-muted-foreground"
                                >
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm transition-colors duration-200 text-foreground hover:text-muted-foreground"
                                >
                                    Shipping
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm transition-colors duration-200 text-foreground hover:text-muted-foreground"
                                >
                                    Returns
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-sm font-medium uppercase tracking-wider mb-4 text-muted-foreground">
                            Store Updates
                        </h4>
                        {subscribed ? (
                            <p className="text-sm text-foreground">
                                Thanks for subscribing!
                            </p>
                        ) : (
                            <form onSubmit={handleSubscribe} className="space-y-3">
                                <input
                                    suppressHydrationWarning
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    placeholder="Your phone number"
                                    required
                                    className="w-full px-4 py-3 text-sm rounded border border-border bg-background text-foreground transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                                />
                                <Button
                                    suppressHydrationWarning
                                    type="submit"
                                    className="w-full h-11 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded transition-colors duration-200"
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
                        className="text-muted-foreground hover:text-primary transition-all duration-200 ease-in-out"
                        aria-label="Instagram"
                    >
                        <HugeiconsIcon icon={InstagramIcon} size={20} />
                    </a>
                    <a
                        href="#"
                        className="text-muted-foreground hover:text-primary transition-all duration-200 ease-in-out"
                        aria-label="Twitter"
                    >
                        <HugeiconsIcon icon={NewTwitterIcon} size={20} />
                    </a>
                    <a
                        href="#"
                        className="text-muted-foreground hover:text-primary transition-all duration-200 ease-in-out"
                        aria-label="Facebook"
                    >
                        <HugeiconsIcon icon={Facebook01Icon} size={20} />
                    </a>
                </div>

                {/* Bottom bar */}
                <div className="pt-8 text-center">
                    <p className="text-xs text-muted-foreground">
                        Powered by{" "}
                        <Link
                            href="https://vendlyafrica.store"
                            className="font-medium text-foreground hover:text-primary transition-all duration-200 ease-in-out"
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
