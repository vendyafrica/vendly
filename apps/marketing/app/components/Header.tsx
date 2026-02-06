"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? "glass shadow-md py-3"
                    : "bg-transparent py-5"
                }`}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-accent flex items-center justify-center">
                        <span className="text-white font-bold text-xl font-heading">V</span>
                    </div>
                    <span className="text-2xl font-bold text-primary font-heading">Vendly</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link
                        href="#how-it-works"
                        className="text-gray-600 hover:text-primary transition-colors font-medium"
                    >
                        How It Works
                    </Link>
                    <Link
                        href="#features"
                        className="text-gray-600 hover:text-primary transition-colors font-medium"
                    >
                        Features
                    </Link>
                    <Link
                        href="#sellers"
                        className="text-gray-600 hover:text-primary transition-colors font-medium"
                    >
                        For Sellers
                    </Link>
                </nav>

                {/* CTAs */}
                <div className="hidden md:flex items-center gap-4">
                    <Link
                        href="/login"
                        className="text-gray-600 hover:text-primary transition-colors font-medium"
                    >
                        Sign In
                    </Link>
                    <Link href="/signup" className="btn btn-primary">
                        Start Selling Free
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <svg
                        className="w-6 h-6 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        {isMobileMenuOpen ? (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        ) : (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 glass shadow-lg border-t border-gray-100 animate-fade-in">
                    <nav className="container mx-auto px-6 py-6 flex flex-col gap-4">
                        <Link
                            href="#how-it-works"
                            className="text-gray-600 hover:text-primary transition-colors font-medium py-2"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            How It Works
                        </Link>
                        <Link
                            href="#features"
                            className="text-gray-600 hover:text-primary transition-colors font-medium py-2"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Features
                        </Link>
                        <Link
                            href="#sellers"
                            className="text-gray-600 hover:text-primary transition-colors font-medium py-2"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            For Sellers
                        </Link>
                        <hr className="border-gray-200" />
                        <Link
                            href="/login"
                            className="text-gray-600 hover:text-primary transition-colors font-medium py-2"
                        >
                            Sign In
                        </Link>
                        <Link href="/signup" className="btn btn-primary w-full">
                            Start Selling Free
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}
