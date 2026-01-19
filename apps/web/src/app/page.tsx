"use client";

import { useEffect } from "react";
import Link from "next/link";
import Header from "@/components/marketplace/header";
import Footer from "@/components/marketplace/footer";
import { Button } from "@Vendly/ui/components/button";
import { signInWithOneTap } from "@/lib/auth";

export default function HomePage() {
    useEffect(() => {
        const timer = setTimeout(() => {
            signInWithOneTap().catch(console.error);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <main className="min-h-screen bg-white">
            <Header />
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
