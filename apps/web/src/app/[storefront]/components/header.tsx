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

const niconne = Niconne({
    weight: ['400'], // Choose the weights you need
    subsets: ['latin'],
    display: 'swap',
});

export function StorefrontHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <header className="bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Left: Logo + Desktop Nav */}
                        <div className="flex items-center">
                            <nav className="hidden md:block">
                                <ul className="flex space-x-4">
                                    <li>
                                        <Link
                                            href="/"
                                            className="text-sm text-black transition"
                                        >
                                            Home
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/collections"
                                            className="text-sm text-black transition"
                                        >
                                            Collections
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/categories"
                                            className="text-sm text-black transition"
                                        >
                                            Categories
                                        </Link>
                                    </li>
                                </ul>
                            </nav>
                        </div>

                        <Link
                            href="/"
                            className={`${niconne.className} text-3xl font-semibold text-black`}
                        >
                            vendly.
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
                            vendly.
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
                        <Link
                            href="/collections"
                            onClick={() => setIsMenuOpen(false)}
                            className="text-3xl font-medium text-gray-800 hover:text-black transition"
                        >
                            Collections
                        </Link>
                        <Link
                            href="/categories"
                            onClick={() => setIsMenuOpen(false)}
                            className="text-3xl font-medium text-gray-800 hover:text-black transition"
                        >
                            Categories
                        </Link>
                        <Link
                            href="/contact"
                            onClick={() => setIsMenuOpen(false)}
                            className="text-3xl font-medium text-gray-800 hover:text-black transition"
                        >
                            Contact
                        </Link>
                    </nav>
                </div>
            )}
        </>
    );
}