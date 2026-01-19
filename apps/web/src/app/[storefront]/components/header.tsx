"use client";

import { useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    ShoppingBag02Icon,
    UserIcon,
    Menu01Icon,
    Cancel01Icon,
    StarIcon,
} from "@hugeicons/core-free-icons";
import { Niconne } from 'next/font/google';
import { StoreHeaderConfig } from "@vendly/ui/src/types/store-config";

const niconne = Niconne({
    weight: ['400'],
    subsets: ['latin'],
    display: 'swap',
});

interface StorefrontHeaderProps {
    config: StoreHeaderConfig;
}

export function StorefrontHeader({ config }: StorefrontHeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { storeName, navLinks } = config;

    return (
        <>
            <header className="bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Left: Logo + Desktop Nav */}
                        <div className="flex items-center">
                            <nav className="hidden md:block">
                                <ul className="flex space-x-4">
                                    {navLinks.map((link) => (
                                        <li key={link.href}>
                                            <Link
                                                href={link.href}
                                                className="text-sm text-black transition"
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </div>

                        <Link
                            href="/"
                            className={`${niconne.className} text-3xl font-semibold text-black`}
                        >
                            {storeName}
                        </Link>

                        {/* Right: Icons + Mobile Menu Button */}
                        <div className="flex items-center space-x-6">

                            <Link href="/account" className="text-black transition">
                                <HugeiconsIcon icon={UserIcon} size={19} />
                            </Link>

                            <Link href="/cart" className="text-black transition">
                                <HugeiconsIcon icon={ShoppingBag02Icon} size={19} />
                            </Link>


                            <Link href="/cart" className="text-black transition">
                                <HugeiconsIcon icon={StarIcon} size={19} />
                            </Link>

                            <button
                                className="md:hidden text-black transition"
                                onClick={() => setIsMenuOpen(true)}
                            >
                                <HugeiconsIcon icon={Menu01Icon} size={19} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-50 bg-white flex flex-col">
                    <div className="flex justify-between items-center p-6 border-b border-gray-100">
                        <Link href="/" className="text-xl font-bold items-start text-black">
                            {storeName}
                        </Link>
                        <button
                            onClick={() => setIsMenuOpen(false)}
                            className="text-gray-600 hover:text-black transition"
                        >
                            <HugeiconsIcon icon={Cancel01Icon} size={20} />
                        </button>
                    </div>

                    <nav className="flex-1 flex flex-col items-center justify-center space-y-10">
                        <Link
                            href="/"
                            onClick={() => setIsMenuOpen(false)}
                            className="text-3xl font-medium text-gray-800 hover:text-black transition"
                        >
                            Home
                        </Link>
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMenuOpen(false)}
                                className="text-3xl font-medium text-gray-800 hover:text-black transition"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </>
    );
}
