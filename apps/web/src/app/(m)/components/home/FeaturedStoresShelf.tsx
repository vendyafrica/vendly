"use client";

import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { StarIcon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import type { MarketplaceStore } from "@/types/marketplace";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNavigation,
} from "@vendly/ui/components/carousel";

interface FeaturedStoresShelfProps {
    stores: MarketplaceStore[];
}

export function FeaturedStoresShelf({ stores }: FeaturedStoresShelfProps) {
    if (!stores || stores.length === 0) return null;

    return (
        <section className="py-12 bg-background">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight mb-1">Featured Stores</h2>
                        <p className="text-muted-foreground">Hand-picked brands we think you&apos;ll love</p>
                    </div>
                    <Link 
                        href="/stores" 
                        className="hidden md:flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
                    >
                        View all
                        <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
                    </Link>
                </div>

                <Carousel className="w-full group">
                    <CarouselContent className="-ml-4">
                        {stores.slice(0, 8).map((store) => (
                            <CarouselItem key={store.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                                <Link href={`/${store.slug}`} className="group block h-full">
                                    <div className="relative aspect-video overflow-hidden rounded-2xl bg-muted border border-border/50">
                                        {store.heroMediaItems?.[0]?.url || store.images?.[0] ? (
                                            <Image
                                                src={store.heroMediaItems?.[0]?.url || store.images?.[0] || ""}
                                                alt={store.name}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full bg-muted/50 text-muted-foreground">
                                                No image
                                            </div>
                                        )}
                                        
                                        {/* Overlay gradient */}
                                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-90" />
                                        
                                        {/* Store Info Overlay */}
                                        <div className="absolute bottom-0 left-0 p-5 w-full text-white">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 bg-background/10 backdrop-blur-sm">
                                                    {store.logoUrl || store.instagramAvatarUrl ? (
                                                        <Image
                                                            src={store.logoUrl || store.instagramAvatarUrl || ""}
                                                            alt={store.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-primary text-white font-bold">
                                                            {store.name.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg leading-tight group-hover:underline decoration-white/50 underline-offset-4">
                                                        {store.name}
                                                    </h3>
                                                    {store.categories.length > 0 && (
                                                        <p className="text-white/80 text-xs font-medium">
                                                            {store.categories[0]}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            {store.description && (
                                                <p className="text-white/70 text-sm line-clamp-1 pl-[52px]">
                                                    {store.description}
                                                </p>
                                            )}
                                        </div>

                                        {/* Rating Badge */}
                                        {store.rating > 0 && (
                                            <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-full border border-white/10">
                                                <span>{store.rating}</span>
                                                <HugeiconsIcon icon={StarIcon} size={12} className="text-yellow-400 fill-yellow-400" />
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselNavigation className="hidden md:flex opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex justify-end gap-2 mt-4 md:hidden px-4">
                         {/* Mobile navigation or dots could go here */}
                    </div>
                </Carousel>
            </div>
        </section>
    );
}
