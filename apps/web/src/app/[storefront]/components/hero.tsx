"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { StarIcon } from "@hugeicons/core-free-icons";
import { HeroSkeleton } from "./skeletons";

interface StoreData {
    name: string;
    slug: string;
    description: string | null;
    rating: number;
    ratingCount: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function Hero() {
    const params = useParams();
    const [store, setStore] = useState<StoreData | null>(null);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <HeroSkeleton />;
    if (!store) return null;

    // Format rating count for display (e.g., 275100 -> "275.1K")
    const formatRatingCount = (count: number) => {
        if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}K`;
        }
        return count.toString();
    };

    return (
        <section className="relative h-[85vh] w-full overflow-hidden">
            <div className="relative h-full w-full overflow-hidden rounded-b-[60px] md:rounded-b-[100px]">

                <Image
                    src="/images/linen-shirt.png"
                    alt="Hero Background"
                    fill
                    priority
                    className="object-cover"
                />

                <div className="absolute inset-0 bg-black/10" />

                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
                    <h1 className="text-7xl md:text-[12rem] font-serif leading-none tracking-tight">
                        {store.name}
                    </h1>
                </div>

                <div className="absolute bottom-10 left-6 md:left-12 text-white">
                    <h2 className="text-2xl md:text-3xl font-bold">{store.name}</h2>
                    <div className="flex items-center gap-1 mt-1">
                        <span className="text-sm font-medium">{store.rating.toFixed(1)}</span>
                        <HugeiconsIcon icon={StarIcon} size={14} className="fill-white" />
                        <span className="text-xs opacity-80 ml-1">({formatRatingCount(store.ratingCount)})</span>
                    </div>
                </div>
            </div>
        </section>
    );
}