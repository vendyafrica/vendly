"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserIcon, ShoppingBasket01Icon, FavouriteIcon, Menu01Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import Image from "next/image";

interface NavigationItem {
    label: string;
    href: string;
}

interface HeaderProps {
    storeSlug?: string;
    storeName?: string;
    logoUrl?: string; // Add logo support
    navItems?: NavigationItem[]; // Dynamic nav
    overlay?: boolean;
    showSearch?: boolean;
    showCart?: boolean;
    showUser?: boolean;
    sticky?: boolean;
}

export function Header({
    storeSlug,
    storeName,
    logoUrl,
    navItems = [],
    overlay,
    showSearch = true,
    showCart = true,
    showUser = true,
    sticky = true,
}: HeaderProps) {
    const { toggleCart, totalItems } = useCart();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Use CSS variables injected by StorefrontHome
    const bgColor = overlay ? "transparent" : "var(--background, #ffffff)";
    const textColor = overlay ? "rgba(255,255,255,0.95)" : "var(--foreground, #111111)";
    const borderColor = "var(--border, transparent)";

    // Default nav items if none provided
    const displayNavItems = navItems.length > 0 ? navItems : [
        { label: "Products", href: `/${storeSlug}/products` },
    ];

    return (
        <header
            className={`${sticky ? "sticky top-0" : "relative"} z-50 border-b transition-colors duration-300`}
            style={{
                backgroundColor: bgColor,
                color: textColor,
                borderColor: overlay ? "transparent" : borderColor,
                fontFamily: "var(--font-body, inherit)",
                backdropFilter: overlay ? undefined : "saturate(180%) blur(5px)",
            }}
        >
            <div className="mx-auto px-4 lg:px-8 max-w-[var(--container-max,1400px)]">
                <div className="flex h-16 items-center justify-between">
                    {/* Left: Mobile Menu & Desktop Nav */}
                    <div className="flex items-center gap-6">
                        <button
                            className="lg:hidden p-1 -ml-1 hover:opacity-70 transition-opacity"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            style={{ color: textColor }}
                        >
                            <HugeiconsIcon icon={Menu01Icon} />
                        </button>

                        <nav className="hidden lg:flex items-center gap-6">
                            {displayNavItems.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="text-sm font-medium transition-colors hover:opacity-70"
                                    style={{ color: textColor }}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Center: Logo */}
                    <Link
                        href={`/${storeSlug}`}
                        className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center transition-opacity hover:opacity-90"
                        style={{
                            color: textColor,
                            fontFamily: "var(--font-heading, inherit)",
                        }}
                    >
                        {logoUrl ? (
                            <div className="relative h-8 w-auto aspect-[3/1]">
                                <Image
                                    src={logoUrl}
                                    alt={storeName || "Store"}
                                    width={120}
                                    height={40}
                                    className="object-contain"
                                    style={{ filter: overlay ? "brightness(0) invert(1)" : "none" }}
                                />
                            </div>
                        ) : (
                            <span className="text-xl font-bold tracking-tight">
                                {storeName || "Store"}
                            </span>
                        )}
                    </Link>

                    {/* Right: Actions */}
                    <div className="flex items-center space-x-4 ml-auto">
                        {showSearch && (
                            <button
                                className="p-1 hover:opacity-70 transition-opacity"
                                style={{ color: textColor }}
                            >
                                <HugeiconsIcon icon={Search01Icon} />
                            </button>
                        )}

                        {showUser && (
                            <button
                                className="hidden sm:flex p-1 hover:opacity-70 transition-opacity"
                                style={{ color: textColor }}
                            >
                                <HugeiconsIcon icon={UserIcon} />
                            </button>
                        )}

                        {showCart && (
                            <button
                                onClick={toggleCart}
                                className="relative p-1 hover:opacity-70 transition-opacity group"
                                style={{ color: textColor }}
                            >
                                <HugeiconsIcon icon={ShoppingBasket01Icon} />
                                {totalItems > 0 && (
                                    <span
                                        className="absolute -top-1 -right-1 h-4 w-4 text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm"
                                        style={{
                                            backgroundColor: "var(--primary, #111)",
                                            color: "var(--primary-foreground, #fff)",
                                        }}
                                    >
                                        {totalItems}
                                    </span>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown (Simple implementation) */}
            {mobileMenuOpen && (
                <div className="lg:hidden absolute top-16 left-0 right-0 bg-white border-b shadow-lg z-40 p-4"
                    style={{
                        backgroundColor: "var(--background, #ffffff)",
                        borderColor: borderColor
                    }}
                >
                    <nav className="flex flex-col gap-4">
                        {displayNavItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="text-base font-medium py-2 border-b border-gray-100 last:border-0"
                                onClick={() => setMobileMenuOpen(false)}
                                style={{ color: "var(--foreground, #111)" }}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
}
