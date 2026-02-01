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

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

export function StorefrontHeader() {
    const params = useParams();
    const { itemCount } = useCart();
    const [store, setStore] = useState<StoreData | null>(null);

    const [loading, setLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const fetchStore = async () => {
            const slug = params?.s as string;
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
    }, [params?.s]);

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY < 80);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (loading) return <HeaderSkeleton />;
    if (!store) return null;

    const iconClass = "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]";

    return (
        <header
            className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}
        >
            <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/35 via-black/15 to-transparent" />

            <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10">
                <div className="flex items-center justify-between h-16 sm:h-[70px] md:h-20 gap-6">
                    <div className="flex items-center gap-4">
                        <Link
                            href={`/${store.slug}`}
                            className="text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)] font-serif text-xl sm:text-2xl tracking-tight hover:text-white/90 transition-colors"
                        >
                            {store.name}
                        </Link>
                    </div>
                    <div className="flex items-center space-x-1.5 sm:space-x-2">
                        <Link href="/cart">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative rounded-full bg-white/5 hover:bg-white/10 min-h-[44px] min-w-[44px] p-2 sm:p-2.5 cursor-pointer"
                            >
                                <HugeiconsIcon icon={ShoppingBag02Icon} size={22} className={iconClass} />
                                {itemCount > 0 && (
                                    <span className="pointer-events-none absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-medium text-white">
                                        {itemCount}
                                    </span>
                                )}
                            </Button>
                        </Link>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full bg-white/5 hover:bg-white/10 min-h-[44px] min-w-[44px] p-2 sm:p-2.5 cursor-pointer"
                        >
                            <HugeiconsIcon icon={StarIcon} size={22} className={iconClass} />
                        </Button>
                        <Link href={`/login?store=${encodeURIComponent(store.name)}&slug=${encodeURIComponent(store.slug)}`}>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full bg-white/5 hover:bg-white/10 min-h-[44px] min-w-[44px] p-2 sm:p-2.5 cursor-pointer"
                            >
                                <HugeiconsIcon icon={UserIcon} size={22} className={iconClass} />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}