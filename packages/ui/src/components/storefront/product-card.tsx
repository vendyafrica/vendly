"use client";

import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ShoppingBasket01Icon, FavouriteIcon } from "@hugeicons/core-free-icons";
import { cn } from "../../lib/utils";
import { Button } from "../button";

interface ProductCardProps {
    id: string;
    title: string;
    price: number;
    currency: string;
    imageUrl?: string;
    storeSlug: string;
    onAddToCart?: (id: string) => void;
    className?: string;
}

export function ProductCard({
    id,
    title,
    price,
    currency,
    imageUrl,
    storeSlug,
    onAddToCart,
    className,
}: ProductCardProps) {
    const formattedPrice = new Intl.NumberFormat('en-KE', {
        style: "currency",
        currency: currency,
    }).format(price);

    return (
        <div className={cn("group relative flex flex-col h-full bg-white rounded-lg overflow-hidden border border-transparent transition-all hover:border-[var(--border,#e5e7eb)] hover:shadow-lg", className)}>
            {/* Image Container */}
            <Link href={`/${storeSlug}/products/${id}`} className="relative aspect-square bg-gray-100 overflow-hidden">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        <span className="text-sm">No Image</span>
                    </div>
                )}

                {/* Overlay Actions */}
                <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="bg-white p-2 rounded-full shadow-md text-gray-900 hover:text-primary hover:bg-gray-50 transition-colors">
                        <HugeiconsIcon icon={FavouriteIcon} size={18} />
                    </button>
                </div>
            </Link>

            {/* Content */}
            <div className="flex flex-col flex-grow p-4">
                <Link href={`/${storeSlug}/products/${id}`} className="block mb-2">
                    <h3 className="text-base font-medium text-[var(--foreground,#111)] line-clamp-2 transition-colors hover:text-[var(--primary,#111)]">
                        {title}
                    </h3>
                </Link>

                <div className="mt-auto flex items-center justify-between">
                    <span className="text-lg font-bold text-[var(--foreground,#111)]">
                        {formattedPrice}
                    </span>

                    <Button
                        size="sm"
                        variant="ghost"
                        className="rounded-full h-8 w-8 p-0 border border-gray-200 hover:border-primary hover:bg-primary hover:text-white"
                        onClick={(e) => {
                            e.preventDefault();
                            onAddToCart?.(id);
                        }}
                    >
                        <HugeiconsIcon icon={ShoppingBasket01Icon} size={16} />
                    </Button>
                </div>
            </div>
        </div>
    );
}
