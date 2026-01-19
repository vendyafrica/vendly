"use client";

import Link from "next/link";
import { Niconne } from 'next/font/google';

const niconne = Niconne({
    weight: ['400'],
    subsets: ['latin'],
    display: 'swap',
});

export default function CheckoutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Minimal Header */}
            <header className="fixed top-0 w-full h-16 bg-white border-b border-neutral-100 flex items-center justify-center z-50">
                <Link
                    href="/"
                    className={`${niconne.className} text-3xl font-semibold text-black hover:text-neutral-700 transition`}
                >
                    vendly.
                </Link>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
                {children}
            </main>
        </div>
    );
}