"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";


// Mock data for demonstration when no recent items exist
const MOCK_RECENT_ITEMS = [
    {
        id: "mock-1",
        name: "Vintage Denim Jacket",
        price: 8500,
        currency: "KES",
        image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2070&auto=format&fit=crop",
        store: { name: "Vintage Vault", slug: "vintage-vault" },
        slug: "vintage-denim-jacket"
    },
    {
        id: "mock-2",
        name: "Leather Crossbody Bag",
        price: 4200,
        currency: "KES",
        image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1973&auto=format&fit=crop",
        store: { name: "Leather & Co", slug: "leather-co" },
        slug: "leather-crossbody-bag"
    },
    {
        id: "mock-3",
        name: "Minimalist Watch",
        price: 12000,
        currency: "KES",
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2020&auto=format&fit=crop",
        store: { name: "Timepiece", slug: "timepiece" },
        slug: "minimalist-watch"
    },
    {
        id: "mock-4",
        name: "Summer Floral Dress",
        price: 3500,
        currency: "KES",
        image: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?q=80&w=2011&auto=format&fit=crop",
        store: { name: "Summer Vibes", slug: "summer-vibes" },
        slug: "summer-floral-dress"
    }
];

interface RecentItem {
    id: string;
    name: string;
    price: number;
    currency: string;
    image: string;
    store: {
        name: string;
        slug: string;
    };
    slug: string;
}

const aspectVariants = [
    "aspect-[3/4]",
    "aspect-[4/5]",
    "aspect-[1/1]",
    "aspect-[4/5]",
    "aspect-[3/4]",
    "aspect-[5/6]",
];

export default function RecentlyViewed() {
    const [items, setItems] = useState<RecentItem[]>([]);

    useEffect(() => {
        // In a real app, this would be populated by tracking page views
        // For now, we fallback to mock data to demonstrate the UI
        const stored = localStorage.getItem("vendly_recent_items");
        if (stored) {
            try {
                setItems(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse recent items", e);
                setItems(MOCK_RECENT_ITEMS);
            }
        } else {
            setItems(MOCK_RECENT_ITEMS);
        }
    }, []);

    if (items.length === 0) return null;

    return (
        <div className="py-8">
            <h2 className="text-xl font-semibold mb-6">Recently viewed</h2>

            <div className="columns-2 md:columns-4 gap-3 md:gap-4 [column-fill:balance]">
                {items.map((item, index) => {
                    const aspectClass = aspectVariants[index % aspectVariants.length];

                    return (
                        <Link
                            key={item.id}
                            href={`/${item.store.slug}/products/${item.slug}`}
                            className="group block break-inside-avoid mb-3 md:mb-4"
                        >
                            {/* Image Container */}
                            <div className={`relative overflow-hidden rounded-lg ${aspectClass} bg-neutral-100`}>
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover transition-all duration-700 ease-out group-hover:scale-[1.03]"
                                />
                                {/* Subtle hover overlay */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                            </div>

                            {/* Product Info */}
                            <div className="mt-2 px-0.5">
                                <h3 className="text-[13px] sm:text-sm font-normal text-neutral-900 leading-tight line-clamp-2 mb-1">
                                    {item.name}
                                </h3>
                                <p className="text-xs text-neutral-500 mb-0.5">
                                    {item.store.name}
                                </p>
                                <p className="text-xs sm:text-[13px] font-medium text-neutral-600">
                                    {item.currency} {item.price.toLocaleString()}
                                </p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
