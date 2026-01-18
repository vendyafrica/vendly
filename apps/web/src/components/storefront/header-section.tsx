"use client";

import { useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ShoppingBag02Icon, UserIcon, Search01Icon, Menu01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";

interface StorefrontHeaderProps {
    storeName: string;
    isTransparent?: boolean;
}

// Fixed category navigation - max 4 shown
const CATEGORIES = [
    { label: "Women", href: "/women" },
    { label: "Men", href: "/men" },
    { label: "Accessories", href: "/accessories" },
    { label: "Sale", href: "/sale" },
];

export function StorefrontHeader({ storeName, isTransparent = false }: StorefrontHeaderProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header
            className={`absolute top-0 left-0 right-0 z-50 transition-colors ${isTransparent ? "bg-transparent" : "bg-white border-b border-neutral-100"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* Left side - Categories (desktop) */}
                <nav className="hidden md:flex items-center gap-6 flex-1">
                    {CATEGORIES.map((cat) => (
                        <Link
                            key={cat.label}
                            href={cat.href}
                            className={`text-sm font-medium transition-colors ${isTransparent
                                ? "text-white/90 hover:text-white"
                                : "text-neutral-600 hover:text-black"
                                }`}
                        >
                            {cat.label}
                        </Link>
                    ))}
                </nav>

                {/* Mobile menu button */}
                <button
                    className="md:hidden p-2 -ml-2"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <HugeiconsIcon
                        icon={isMobileMenuOpen ? Cancel01Icon : Menu01Icon}
                        size={24}
                        className={isTransparent ? "text-white" : "text-black"}
                    />
                </button>

                {/* Center - Store name */}
                <Link
                    href="/"
                    className={`text-xl font-bold tracking-tight ${isTransparent ? "text-white" : "text-black"
                        }`}
                >
                    {storeName}
                </Link>

                {/* Right side - Icons */}
                <div className="flex items-center gap-1 flex-1 justify-end">
                    <button
                        className={`p-2 transition-colors ${isTransparent ? "text-white/90 hover:text-white" : "text-neutral-600 hover:text-black"
                            }`}
                        aria-label="Search"
                    >
                        <HugeiconsIcon icon={Search01Icon} size={20} />
                    </button>

                    <button
                        className={`p-2 transition-colors ${isTransparent ? "text-white/90 hover:text-white" : "text-neutral-600 hover:text-black"
                            }`}
                        aria-label="Account"
                    >
                        <HugeiconsIcon icon={UserIcon} size={20} />
                    </button>

                    <button
                        className={`p-2 relative transition-colors ${isTransparent ? "text-white/90 hover:text-white" : "text-neutral-600 hover:text-black"
                            }`}
                        aria-label="Cart"
                    >
                        <HugeiconsIcon icon={ShoppingBag02Icon} size={20} />
                        {/* Cart badge - TODO: Connect to cart state */}
                        <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                            0
                        </span>
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
                <div className={`md:hidden ${isTransparent ? "bg-black/80 backdrop-blur-sm" : "bg-white"} border-t border-neutral-100/20`}>
                    <nav className="flex flex-col py-4">
                        {CATEGORIES.map((cat) => (
                            <Link
                                key={cat.label}
                                href={cat.href}
                                className={`px-6 py-3 text-base font-medium ${isTransparent ? "text-white" : "text-neutral-900"
                                    }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {cat.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
}
