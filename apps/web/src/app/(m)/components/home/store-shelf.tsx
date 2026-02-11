"use client";

import Link from "next/link";
import { Button } from "@vendly/ui/components/button";
import type { MarketplaceStore } from "@/types/marketplace";
import { StoreCard } from "@/app/(m)/components/store-card";

interface StoreShelfProps {
    title: string;
    stores: MarketplaceStore[];
    categorySlug: string;
}

export function StoreShelf({ title, stores, categorySlug }: StoreShelfProps) {
    if (!stores || stores.length === 0) return null;

    // Limit to first 10 stores
    const displayedStores = stores.slice(0, 10);
    const hasMore = stores.length > 10;

    return (
        <section className="py-8 bg-background">
            <div className="container mx-auto px-5 sm:px-6">
                {/* Header */}
                <div className="flex items-center justify-between gap-2 mb-6">
                    <h2 className="text-xl font-bold tracking-tight">{title}</h2>
                </div>

                {/* Grid - 2 columns on mobile, 5 on desktop */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                    {displayedStores.map((store) => (
                        <StoreCard key={store.id} store={store} />
                    ))}
                </div>

                {/* See More Button */}
                {hasMore && (
                    <div className="flex justify-center mt-8">
                        <Link href={`/category/${categorySlug}`}>
                            <Button
                                variant="outline"
                                size="lg"
                                className="min-w-[200px]"
                            >
                                See more
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
