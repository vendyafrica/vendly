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
        <footer className="pt-12 pb-7 border-t bg-[#F9F9F7] border-neutral-200">
            <div className="max-w-7xl mx-auto px-6">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    <div>
                        <h3 className="text-base font-medium mb-2 text-neutral-900">{storeName}</h3>
                        <p className="text-sm leading-relaxed text-neutral-500">
                            {storeDescription}
                        </p>
                    </div>


                    <div>
                        <h4 className="text-sm font-medium uppercase tracking-wider mb-4 text-neutral-500">
                            Shop
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="#products"
                                    className="text-sm transition-colors duration-200 text-neutral-900 hover:text-neutral-500"
                                >
                                    All Products
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm transition-colors duration-200 text-neutral-900 hover:text-neutral-500"
                                >
                                    New Arrivals
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm transition-colors duration-200 text-neutral-900 hover:text-neutral-500"
                                >
                                    Best Sellers
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-sm font-medium uppercase tracking-wider mb-4 text-neutral-500">
                            Support
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm transition-colors duration-200 text-neutral-900 hover:text-neutral-500"
                                >
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm transition-colors duration-200 text-neutral-900 hover:text-neutral-500"
                                >
                                    Shipping
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="text-sm transition-colors duration-200 text-neutral-900 hover:text-neutral-500"
                                >
                                    Returns
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-sm font-medium uppercase tracking-wider mb-4 text-neutral-500">
                            Store Updates
                        </h4>
                        {subscribed ? (
                            <p className="text-sm text-neutral-900">
                                Thanks for subscribing!
                            </p>
                        ) : (
                            <form onSubmit={handleSubscribe} className="space-y-3">
                                <input
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    placeholder="Your phone number"
                                    required
                                    className="w-full px-4 py-3 text-sm rounded border border-neutral-200 bg-white text-neutral-900 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                                />
                                <Button
                                    type="submit"
                                    className="w-full h-11 text-sm font-medium bg-neutral-900 text-white hover:bg-primary rounded transition-colors duration-200"
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
                        className="text-neutral-500 hover:text-primary transition-all duration-200 ease-in-out"
                        aria-label="Instagram"
                    >
                        <HugeiconsIcon icon={InstagramIcon} size={20} />
                    </a>
                    <a
                        href="#"
                        className="text-neutral-500 hover:text-primary transition-all duration-200 ease-in-out"
                        aria-label="Twitter"
                    >
                        <HugeiconsIcon icon={NewTwitterIcon} size={20} />
                    </a>
                    <a
                        href="#"
                        className="text-neutral-500 hover:text-primary transition-all duration-200 ease-in-out"
                        aria-label="Facebook"
                    >
                        <HugeiconsIcon icon={Facebook01Icon} size={20} />
                    </a>
                </div>

                {/* Bottom bar */}
                <div className="pt-8 text-center">
                    <p className="text-xs text-neutral-500">
                        Powered by{" "}
                        <Link
                            href="https://vendlyafrica.store"
                            className="font-medium text-neutral-900 hover:text-primary transition-all duration-200 ease-in-out"
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
