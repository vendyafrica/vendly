"use client";

import { useState, useEffect } from "react";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";

import { HugeiconsIcon } from "@hugeicons/react";
import { ShoppingBag02Icon, UserIcon, StarIcon } from "@hugeicons/core-free-icons";
import { Button } from "@vendly/ui/components/button";
import { HeaderSkeleton } from "./skeletons";

interface StoreData {
    name: string;
    slug: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function StorefrontHeader() {
    const params = useParams();
    const pathname = usePathname();
    const [store, setStore] = useState<StoreData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const fetchStore = async () => {
            const slug = params?.storefront as string;
            if (!slug) {
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`${API_BASE}/api/storefront/${slug}`);
                if (res.ok) {
                    setStore(await res.json());
                }
            } catch (error) {
                console.error("Failed to fetch store data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStore();
    }, [params?.storefront]);

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY < 80);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (pathname?.includes("/products/")) return null;
    if (loading) return <HeaderSkeleton />;
    if (!store) return null;

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 bg-transparent transition-all duration-300 ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
            }`}>
            <div className="max-w-[1440px] mx-auto px-6 md:px-12">
                <div className="flex items-center justify-between h-24">

                    <Link href="/" className="text-white font-serif text-2xl tracking-tight">
                        {store.name}
                    </Link>

                    <div className="flex items-center space-x-3">
                        <Button variant="ghost" size="icon" className="bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full hover:bg-white/20 transition-all">
                            <HugeiconsIcon icon={UserIcon} size={20} />
                        </Button>
                        <Button variant="ghost" size="icon" className="bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full hover:bg-white/20 transition-all">
                            <HugeiconsIcon icon={ShoppingBag02Icon} size={20} />
                        </Button>
                        <Button variant="ghost" size="icon" className="bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full hover:bg-white/20 transition-all">
                            <HugeiconsIcon icon={StarIcon} size={20} />
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}