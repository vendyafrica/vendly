"use client";

import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import type { MarketplaceStore } from "@/types/marketplace";
import { StoreCarousel } from "@/app/(m)/components/store-carousel";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@vendly/ui/components/carousel";

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
                                <Link href={`/${store.slug}`} className="group block h-full">
                                    <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-muted border border-border/50 mb-3">
                                        {(() => {
                                            const images = [
                                                ...(store.heroMedia?.filter(Boolean) ?? []),
                                                ...(store.images?.filter(Boolean) ?? []),
                                            ];

                                            if (images.length > 1) {
                                                return (
                                                    <StoreCarousel
                                                        images={images}
                                                        className="h-full"
                                                    />
                                                );
                                            }

                                            if (images.length === 1) {
                                                return (
                                                    <Image
                                                        src={images[0] || ""}
                                                        alt={store.name}
                                                        fill
                                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                        sizes="(max-width: 768px) 280px, (max-width: 1200px) 33vw, 20vw"
                                                    />
                                                );
                                            }

                                            return (
                                            <div className="flex items-center justify-center h-full bg-muted/50 text-muted-foreground text-sm">
                                                No image
                                            </div>
                                            );
                                        })()}
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="relative w-9 h-9 shrink-0 rounded-full overflow-hidden border border-border bg-muted">
                                            {store.logoUrl || store.instagramAvatarUrl ? (
                                                <Image
                                                    src={store.logoUrl || store.instagramAvatarUrl || ""}
                                                    alt={store.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-xs font-bold">
                                                    {store.name.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-semibold text-base leading-tight truncate group-hover:text-primary transition-colors">
                                                {store.name}
                                            </h3>
                                            <p className="text-muted-foreground text-xs truncate mt-0.5">
                                                {store.categories[0] || "Store"}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
        </section>
    );
}