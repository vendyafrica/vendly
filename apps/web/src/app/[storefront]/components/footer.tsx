"use client";

import { useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { InstagramIcon, NewTwitterIcon, Facebook01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@vendly/ui/components/button";


export function StorefrontFooter() {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Connect to newsletter API
        // await fetch('/api/newsletter/subscribe', { method: 'POST', body: JSON.stringify({ email }) });
        setSubscribed(true);
        setEmail("");
    };

    return (
        <footer className="border-t border-neutral-200 pt-12 pb-7">
            <div className="max-w-7xl mx-auto px-6">
                {/* Main footer content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Store info */}
                    <div>
                        <h3 className="text-base font-medium mb-2">vendly</h3>
                        <p className="text-sm text-neutral-500 leading-relaxed">
                            Curated collection of premium products.
                        </p>
                    </div>

                    {/* Quick links */}
                    <div>
                        <h4 className="text-sm font-medium uppercase tracking-wider mb-4 text-neutral-400">
                            Shop
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="#products"
                                    className="text-sm text-neutral-600 hover:text-black transition-colors"
                                >
                                    All Products
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-neutral-600 hover:text-black transition-colors"
                                >
                                    New Arrivals
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-neutral-600 hover:text-black transition-colors"
                                >
                                    Best Sellers
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-sm font-medium uppercase tracking-wider mb-4 text-neutral-400">
                            Support
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-neutral-600 hover:text-black transition-colors"
                                >
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-neutral-600 hover:text-black transition-colors"
                                >
                                    Shipping
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm text-neutral-600 hover:text-black transition-colors"
                                >
                                    Returns
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-sm font-medium uppercase tracking-wider mb-4 text-neutral-400">
                            Store Updates
                        </h4>
                        {subscribed ? (
                            <p className="text-sm text-neutral-600">
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
                                    className="w-full px-4 py-3 text-sm border border-neutral-200 bg-white focus:outline-none focus:border-black transition-colors"
                                />
                                <Button
                                    type="submit"
                                    className="w-full bg-black text-white h-11 text-sm font-medium hover:bg-neutral-800 transition-colors"
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
                        className="text-neutral-400 hover:text-primary transition-colors"
                        aria-label="Instagram"
                    >
                        <HugeiconsIcon icon={InstagramIcon} size={20} />
                    </a>
                    <a
                        href="#"
                        className="text-neutral-400 hover:text-primary transition-colors"
                        aria-label="Twitter"
                    >
                        <HugeiconsIcon icon={NewTwitterIcon} size={20} />
                    </a>
                    <a
                        href="#"
                        className="text-neutral-400 hover:text-primary transition-colors"
                        aria-label="Facebook"
                    >
                        <HugeiconsIcon icon={Facebook01Icon} size={20} />
                    </a>
                </div>

                {/* Bottom bar */}
                <div className="pt-8 text-center">
                    <p className="text-xs text-neutral-400">
                        Powered by{" "}
                        <Link
                            href="https://vendlyafrica.store"
                            className="font-medium text-neutral-600 hover:text-primary transition-colors"
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
