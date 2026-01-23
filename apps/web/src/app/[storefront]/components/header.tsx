"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ShoppingBag02Icon, UserIcon, StarIcon } from "@hugeicons/core-free-icons";
import { Button } from "@vendly/ui/components/button";
import { HeaderSkeleton } from "./skeletons";
import { useCart } from "../../../contexts/cart-context";

interface StoreData {
    name: string;
    slug: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function StorefrontHeader() {
    const params = useParams();
    const { itemCount } = useCart();
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

    if (loading) return <HeaderSkeleton />;
    if (!store) return null;

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"} bg-white/70 backdrop-blur-xl border-b border-white/40`}>
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10">
                <div className="flex items-center justify-between h-20 gap-6">
                    <div className="flex items-center gap-4">
                        <Link href={`/${store.slug}`} className="text-neutral-900 font-serif text-2xl tracking-tight hover:text-neutral-700 transition-colors">
                            {store.name}
                        </Link>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Link href="/cart">
                            <Button variant="ghost" size="icon" className="text-neutral-800 hover:bg-neutral-100 rounded-full relative">
                                <HugeiconsIcon icon={ShoppingBag02Icon} size={20} />
                                {itemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-medium text-white">
                                        {itemCount}
                                    </span>
                                )}
                            </Button>
                        </Link>
                        <Button variant="ghost" size="icon" className="text-neutral-800 hover:bg-neutral-100 rounded-full">
                            <HugeiconsIcon icon={StarIcon} size={20} />
                        </Button>
                        <Button className="bg-black text-white px-6 h-8">
                            Login
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}