"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import type { HeroImage } from "@/types/storefront";
import { StorefrontHeader } from "./header-section";

interface HeroCarouselProps {
    storeName: string;
    heroImages: HeroImage[];
    autoPlayInterval?: number;
}

export function HeroCarousel({
    storeName,
    heroImages,
    autoPlayInterval = 5000,
}: HeroCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, [heroImages.length]);

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    // Auto-rotate carousel
    useEffect(() => {
        if (heroImages.length <= 1) return;

        const interval = setInterval(nextSlide, autoPlayInterval);
        return () => clearInterval(interval);
    }, [heroImages.length, autoPlayInterval, nextSlide]);

    if (heroImages.length === 0) {
        // Fallback when no hero images
        return (
            <section className="relative h-[60vh] min-h-[400px] sm:h-[70vh] sm:min-h-[500px] md:h-[85vh] md:min-h-[600px] bg-neutral-900">
                {/* Header bleeds into hero */}
                <StorefrontHeader storeName={storeName} isTransparent />

                <div className="absolute inset-0 flex items-end pb-16 sm:pb-20 md:pb-24 px-4 sm:px-6 md:px-16">
                    <div className="max-w-md">
                        <p className="text-white/70 text-xs sm:text-sm tracking-widest uppercase mb-2 sm:mb-3">
                            New Collection
                        </p>
                        <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-medium mb-4 sm:mb-6">
                            Discover Our Latest
                        </h1>
                        <Link
                            href="#products"
                            className="inline-block border border-white text-white px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm tracking-wide hover:bg-white hover:text-black transition-colors"
                        >
                            Shop Now
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="relative h-[60vh] min-h-[400px] sm:h-[70vh] sm:min-h-[500px] md:h-[85vh] md:min-h-[600px] overflow-hidden">
            {/* Header bleeds into hero - transparent */}
            <StorefrontHeader storeName={storeName} isTransparent />

            {/* Slides */}
            {heroImages.map((image, index) => (
                <div
                    key={image.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? "opacity-100" : "opacity-0"
                        }`}
                >
                    <Image
                        src={image.imageUrl}
                        alt={image.altText || `${storeName} hero image`}
                        fill
                        className="object-cover object-center"
                        priority={index === 0}
                        sizes="100vw"
                    />
                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-black/10" />
                </div>
            ))}

            {/* Content overlay - positioned bottom left, minimal */}
            <div className="absolute inset-0 flex items-end pb-16 sm:pb-20 md:pb-24 px-4 sm:px-6 md:px-16">
                <div className="max-w-md">
                    <p className="text-white/70 text-xs sm:text-sm tracking-widest uppercase mb-2 sm:mb-3">
                        New Collection
                    </p>
                    <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-medium mb-4 sm:mb-6">
                        Discover Our Latest
                    </h2>
                    <Link
                        href="#products"
                        className="inline-block border border-white text-white px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm tracking-wide hover:bg-white hover:text-black transition-colors"
                    >
                        Shop Now
                    </Link>
                </div>
            </div>

            {/* Carousel indicators - bottom right */}
            {heroImages.length > 1 && (
                <div className="absolute bottom-6 sm:bottom-8 right-4 sm:right-6 md:right-16 z-20 flex gap-1.5 sm:gap-2">
                    {heroImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-6 sm:w-8 h-0.5 transition-all ${index === currentIndex
                                ? "bg-white"
                                : "bg-white/40 hover:bg-white/60"
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
