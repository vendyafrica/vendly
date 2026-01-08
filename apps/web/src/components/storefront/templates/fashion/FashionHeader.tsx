"use client";

import Link from "next/link";
import { ShoppingCart, User, Menu } from "lucide-react";
import { useState } from "react";

export interface FashionHeaderProps {
    storeName: string;
    storeSlug: string;
    backgroundColor?: string;
    textColor?: string;
    showHome?: boolean;
    showShop?: boolean;
    showCart?: boolean;
    showUser?: boolean;
}

export function FashionHeader({
    storeName,
    storeSlug,
    backgroundColor = "#1e3a5f",
    textColor = "#ffffff",
    showHome = true,
    showShop = true,
    showCart = true,
    showUser = true,
}: FashionHeaderProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header
            className="sticky top-0 z-50"
            style={{ backgroundColor, color: textColor }}
        >
            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Left Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {showHome && (
                            <Link
                                href={`/${storeSlug}`}
                                className="text-sm font-medium hover:opacity-80 transition-opacity"
                                style={{ color: textColor }}
                            >
                                Home
                            </Link>
                        )}
                        {showShop && (
                            <Link
                                href={`/${storeSlug}/products`}
                                className="text-sm font-medium hover:opacity-80 transition-opacity"
                                style={{ color: textColor }}
                            >
                                Shop
                            </Link>
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    {/* Center - Store Name/Logo */}
                    <Link
                        href={`/${storeSlug}`}
                        className="absolute left-1/2 -translate-x-1/2 text-xl md:text-2xl font-serif italic font-medium tracking-wide"
                        style={{ color: textColor }}
                    >
                        {storeName}
                    </Link>

                    {/* Right - Icons */}
                    <div className="flex items-center gap-4">
                        {showUser && (
                            <button
                                className="p-2 hover:opacity-80 transition-opacity"
                                aria-label="User account"
                            >
                                <User className="w-5 h-5" />
                            </button>
                        )}
                        {showCart && (
                            <Link
                                href={`/${storeSlug}/cart`}
                                className="p-2 hover:opacity-80 transition-opacity relative"
                                aria-label="Shopping cart"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                <span className="absolute -top-1 -right-1 bg-white text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                                    0
                                </span>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-white/20">
                        <nav className="flex flex-col gap-4">
                            {showHome && (
                                <Link
                                    href={`/${storeSlug}`}
                                    className="text-sm font-medium"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Home
                                </Link>
                            )}
                            {showShop && (
                                <Link
                                    href={`/${storeSlug}/products`}
                                    className="text-sm font-medium"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Shop
                                </Link>
                            )}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}

export default FashionHeader;
