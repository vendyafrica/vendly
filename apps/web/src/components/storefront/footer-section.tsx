"use client";

import { useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { InstagramIcon, NewTwitterIcon, Facebook01Icon } from "@hugeicons/core-free-icons";

interface StorefrontFooterProps {
    storeName: string;
}

export function StorefrontFooter({ storeName }: StorefrontFooterProps) {
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
        <footer className="border-t border-neutral-200 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6">
                {/* Main footer content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Store info */}
                    <div>
                        <h3 className="text-base font-medium mb-4">{storeName}</h3>
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
                            Newsletter
                        </h4>
                        {subscribed ? (
                            <p className="text-sm text-neutral-600">
                                Thanks for subscribing!
                            </p>
                        ) : (
                            <form onSubmit={handleSubscribe} className="space-y-3">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Your email"
                                    required
                                    className="w-full px-4 py-3 text-sm border border-neutral-200 bg-white focus:outline-none focus:border-black transition-colors"
                                />
                                <button
                                    type="submit"
                                    className="w-full bg-black text-white px-4 py-3 text-sm font-medium hover:bg-neutral-800 transition-colors"
                                >
                                    Subscribe
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Social links */}
                <div className="flex justify-center gap-6 mb-8">
                    <a
                        href="#"
                        className="text-neutral-400 hover:text-black transition-colors"
                        aria-label="Instagram"
                    >
                        <HugeiconsIcon icon={InstagramIcon} size={20} />
                    </a>
                    <a
                        href="#"
                        className="text-neutral-400 hover:text-black transition-colors"
                        aria-label="Twitter"
                    >
                        <HugeiconsIcon icon={NewTwitterIcon} size={20} />
                    </a>
                    <a
                        href="#"
                        className="text-neutral-400 hover:text-black transition-colors"
                        aria-label="Facebook"
                    >
                        <HugeiconsIcon icon={Facebook01Icon} size={20} />
                    </a>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-neutral-200 pt-8 text-center">
                    <p className="text-xs text-neutral-400">
                        Powered by{" "}
                        <a
                            href="https://vendlyafrica.store"
                            className="font-medium text-neutral-600 hover:text-black transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Vendly
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
