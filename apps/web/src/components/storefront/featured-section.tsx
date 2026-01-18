"use client";

import { useRef } from "react";
import type { Product } from "@/types/storefront";
import { ProductCard } from "./product-card";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";

interface NewArrivalsSectionProps {
    products: Product[];
}

export function NewArrivalsSection({ products }: NewArrivalsSectionProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (!scrollRef.current) return;
        const scrollAmount = 280;
        scrollRef.current.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    };

    if (products.length === 0) return null;

    return (
        <section className="py-16 md:py-20">
            <div className="max-w-7xl mx-auto px-6">
                {/* Section header */}
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-xl md:text-2xl font-medium tracking-tight">
                        New Arrivals
                    </h2>

                    {/* Navigation arrows */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => scroll("left")}
                            className="w-10 h-10 border border-neutral-200 flex items-center justify-center hover:border-neutral-400 transition-colors bg-white"
                            aria-label="Scroll left"
                        >
                            <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
                        </button>
                        <button
                            onClick={() => scroll("right")}
                            className="w-10 h-10 border border-neutral-200 flex items-center justify-center hover:border-neutral-400 transition-colors bg-white"
                            aria-label="Scroll right"
                        >
                            <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
                        </button>
                    </div>
                </div>

                {/* Scrollable products */}
                <div
                    ref={scrollRef}
                    className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 -mx-6 px-6"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="flex-shrink-0 w-[220px]"
                        >
                            <ProductCard product={product} variant="compact" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
