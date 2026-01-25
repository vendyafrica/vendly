"use client";

import { useEffect } from "react";
import Link from "next/link";
import CategoryCards from "@/app/(platform)/components/CategoryCards";
import FeaturedCategory from "@/app/(platform)/components/FeaturedCategory";
import Header from "@/app/(platform)/components/header";
import Footer from "@/app/(platform)/components/footer";
import { Button } from "@vendly/ui/components/button";
import { signInWithOneTap } from "@/lib/auth";

export default function HomePage() {
    useEffect(() => {
        const timer = setTimeout(() => {
            signInWithOneTap().catch(console.error);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <main className="min-h-screen bg-[#F9F9F7]">
            <Header />
            <CategoryCards />
            <FeaturedCategory />
            <div className="flex flex-col items-center justify-center py-20">
                <h1 className="text-2xl font-semibold mb-4">Welcome to Vendly</h1>
                <p className="text-gray-600 mb-8">The marketplace directory is currently under maintenance.</p>
                <Link href="/onboarding">
                    <Button>
                        Start Selling
                    </Button>
                </Link>
            </div>
            <Footer />
        </main>
    );
}
