"use client";

import { useEffect } from "react";
import React from "react";
import Link from "next/link";
import CategoryCards from "@/app/(platform)/components/CategoryCards";
import FeaturedCategory from "@/app/(platform)/components/FeaturedCategory";
import Header from "@/app/(platform)/components/header";
import Footer from "@/app/(platform)/components/footer";
import { Button } from "@Vendly/ui/components/button";
import { signInWithOneTap } from "@vendly/auth";
import { getCategoriesAction } from "@/actions/categories";

export default function HomePage() {
    const [categories, setCategories] = React.useState<{ id: string; name: string; image: string | null }[]>([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            signInWithOneTap().catch(console.error);
        }, 3000);

        const fetchCategories = async () => {
            const res = await getCategoriesAction();
            if (res.success && res.data) {
                setCategories(res.data);
            }
        };
        fetchCategories();

        return () => clearTimeout(timer);
    }, []);

    return (
        <main className="min-h-screen bg-[#F9F9F7]">
            <Header />
            <CategoryCards categories={categories} />
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
