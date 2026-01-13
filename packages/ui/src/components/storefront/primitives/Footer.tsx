"use client";

import Link from "next/link";
import { WhatsAppIcon, FacebookIcon, InstagramIcon } from "../social";
import { Button } from "../../button";

interface FooterLink {
    label: string;
    url: string;
}

interface FooterColumn {
    title: string;
    links: FooterLink[];
}

interface FooterProps {
    storeSlug: string;
    storeName: string;
    storeDescription?: string;
    columns?: FooterColumn[];
    socialLinks?: {
        facebook?: string;
        instagram?: string;
        whatsapp?: string;
        twitter?: string;
    };
    showNewsletter?: boolean;
}

export function Footer({
    storeSlug,
    storeName,
    storeDescription = "Quality products for your lifestyle. Designed with care and crafted for excellence.",
    columns = [],
    socialLinks,
    showNewsletter = true
}: FooterProps) {
    const currentYear = new Date().getFullYear();

    // Default columns if none provided
    const displayColumns = columns.length > 0 ? columns : [
        {
            title: "Shop",
            links: [
                { label: "All Products", url: `/${storeSlug}/products` },
                { label: "New Arrivals", url: `/${storeSlug}/products?sort=newest` },
                { label: "Best Sellers", url: `/${storeSlug}/products?sort=best-selling` },
            ]
        },
        {
            title: "Support",
            links: [
                { label: "FAQ", url: "#" },
                { label: "Shipping", url: "#" },
                { label: "Returns", url: "#" },
                { label: "Contact", url: "#" },
            ]
        }
    ];

    return (
        <footer
            className="border-t transition-colors duration-300"
            style={{
                backgroundColor: "var(--background, #ffffff)",
                color: "var(--foreground, #111111)",
                borderColor: "var(--border, #e5e7eb)",
            }}
        >
            <div className="mx-auto px-4 lg:px-8 py-16 max-w-[var(--container-max,1400px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link
                            href={`/${storeSlug}`}
                            className="text-2xl font-bold tracking-tight block"
                            style={{ fontFamily: "var(--font-heading, inherit)" }}
                        >
                            {storeName}
                        </Link>
                        <p className="text-sm opacity-70 max-w-xs leading-relaxed">
                            {storeDescription}
                        </p>
                        <div className="flex items-center gap-4">
                            {socialLinks?.facebook && (
                                <a href={socialLinks.facebook} className="opacity-70 hover:opacity-100 transition-opacity" target="_blank" rel="noopener noreferrer">
                                    <FacebookIcon className="w-5 h-5" />
                                </a>
                            )}
                            {socialLinks?.instagram && (
                                <a href={socialLinks.instagram} className="opacity-70 hover:opacity-100 transition-opacity" target="_blank" rel="noopener noreferrer">
                                    <InstagramIcon className="w-5 h-5" />
                                </a>
                            )}
                            {socialLinks?.whatsapp && (
                                <a href={socialLinks.whatsapp} className="opacity-70 hover:opacity-100 transition-opacity" target="_blank" rel="noopener noreferrer">
                                    <WhatsAppIcon className="w-5 h-5" />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Dynamic Columns */}
                    {displayColumns.map((col) => (
                        <div key={col.title}>
                            <h4 className="font-semibold mb-6">{col.title}</h4>
                            <ul className="space-y-4 text-sm opacity-70">
                                {col.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.url}
                                            className="hover:underline hover:text-[var(--primary,#111)] transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Newsletter */}
                    {showNewsletter && (
                        <div>
                            <h4 className="font-semibold mb-6">Stay in the loop</h4>
                            <p className="text-sm opacity-70 mb-4">Subscribe to get special offers and updates.</p>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 bg-transparent border border-[var(--input,#e2e8f0)] rounded px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--ring,#000)]"
                                />
                                <Button size="sm">
                                    Sign Up
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-[var(--border,#e5e7eb)] flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-60">
                    <p>
                        © {currentYear} {storeName}. All rights reserved.
                    </p>
                    <div className="flex items-center gap-1">
                        <span>Powered by</span>
                        <Link
                            href="https://vendlyafrica.store"
                            target="_blank"
                            className="font-semibold hover:text-[var(--primary,#111)] transition-colors"
                        >
                            Vendly
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
