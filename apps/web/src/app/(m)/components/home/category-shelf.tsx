"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import type { MarketplaceStore } from "@/types/marketplace";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@vendly/ui/components/carousel";
import { StoreCard } from "@/app/(m)/components/store-card";

interface CategoryShelfProps {
    title: string;
    stores: MarketplaceStore[];
    categorySlug: string;
}

export function CategoryShelf({ title, stores, categorySlug }: CategoryShelfProps) {
    if (!stores || stores.length === 0) return null;

    return (
        <section className="py-8 bg-background">
            <div className="container mx-auto px-5 sm:px-6">
                <div className="flex items-center justify-between gap-2 mb-4">
                    <h2 className="text-xl font-bold tracking-tight">{title}</h2>
                    <Link
                        href={`/category/${categorySlug}`}
                        className="flex items-center gap-1 text-primary hover:text-primary/80 text-[13px] font-medium transition-colors"
                    >
                        See all
                        <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
                    </Link>
                </div>

                <Carousel className="w-full group">
                    <CarouselContent className="-ml-3 sm:-ml-4">
                        {stores.map((store) => (
                            <CarouselItem key={store.id} className="pl-3 sm:pl-4 basis-[220px] sm:basis-[260px] md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                                <StoreCard store={store} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
        </section>
    );
}