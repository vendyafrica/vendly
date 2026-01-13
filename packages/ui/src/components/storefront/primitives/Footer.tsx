"use client";

import Link from "next/link";
import { WhatsAppIcon, FacebookIcon, InstagramIcon } from "../social";


interface ContentProps {
    newsletterTitle?: string;
    newsletterSubtitle?: string | null;
}

interface FooterProps {
    storeSlug: string;
    storeName: string;
    storeDescription?: string;
    content?: ContentProps;
}

export function Footer({ storeSlug, storeName, content }: FooterProps) {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { icon: FacebookIcon, href: "https://www.facebook.com/", label: "Facebook" },
        { icon: WhatsAppIcon, href: "https://www.whatsapp.com/", label: "Whatsapp" },
    ];

    return (
        <footer
            className="border-t"
            style={{
                backgroundColor: "var(--background, #ffffff)",
                color: "var(--foreground, #111111)",
                borderColor: "var(--border, transparent)",
            }}
        >
            <div className="mx-auto px-4 lg:px-8 py-16 max-w-[var(--container-max,1400px)]">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

                    {/* Brand Column */}
                    <div className="md:col-span-1 space-y-6">
                        <Link
                            href={`/${storeSlug}`}
                            className="text-2xl font-bold tracking-tight block"
                            style={{ fontFamily: "var(--font-heading, inherit)" }}
                        >
                            {storeName}
                        </Link>
                        <p className="text-sm opacity-70 max-w-xs">
                            Quality products for your lifestyle. Designed with care and crafted for excellence.
                        </p>
                        <div className="flex items-center gap-4">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;

                                return (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        aria-label={social.label}
                                        className="w-5 h-5"
                                    >
                                        <Icon
                                            className="w-5 h-5 opacity-80 transition-opacity hover:opacity-100"
                                            aria-hidden
                                        />
                                    </a>
                                );
                            })}
                        </div>

                    </div>

                    {/* Links Columns */}
                    <div>
                        <h4 className="font-semibold mb-6">Shop</h4>
                        <ul className="space-y-4 text-sm opacity-70">
                            <li><Link href={`/${storeSlug}/products`} className="hover:text-[var(--primary)] hover:underline">All Products</Link></li>
                            <li><Link href="#" className="hover:text-[var(--primary)] hover:underline">New Arrivals</Link></li>
                            <li><Link href="#" className="hover:text-[var(--primary)] hover:underline">Best Sellers</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-6">Support</h4>
                        <ul className="space-y-4 text-sm opacity-70">
                            <li><Link href="#" className="hover:text-[var(--primary)] hover:underline">FAQ</Link></li>
                            <li><Link href="#" className="hover:text-[var(--primary)] hover:underline">Shipping & Returns</Link></li>
                            <li><Link href="#" className="hover:text-[var(--primary)] hover:underline">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-semibold mb-6">{content?.newsletterTitle || "Stay in the loop"}</h4>
                        <p className="text-sm opacity-70 mb-4">{content?.newsletterSubtitle || "Subscribe to get special offers and updates."}</p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 bg-transparent border border-[var(--input,#e2e8f0)] rounded-[var(--radius)] px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
                            />
                            <button className="bg-[var(--primary)] text-[var(--primary-foreground)] px-4 py-2 rounded-[var(--radius)] text-sm font-medium">
                                Sign Up
                            </button>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-60">
                    <p>
                        © {currentYear} {storeName}. All rights reserved.
                    </p>
                    <div className="flex items-center gap-1">
                        <span>Powered by</span>
                        <Link
                            href="https://vendlyafrica.store"
                            target="_blank"
                            className="font-semibold hover:text-[var(--primary)]"
                        >
                            Vendly
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
