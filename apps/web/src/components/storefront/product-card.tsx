"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/storefront";
import { formatPrice } from "@/lib/storefront-data";

interface ProductCardProps {
    product: Product;
    variant?: "default" | "compact";
}

export function ProductCard({ product, variant = "default" }: ProductCardProps) {
    const primaryImage = product.images.find((img) => img.isFeatured) || product.images[0];

    return (
        <Link
            href={`/product/${product.id}`}
            className="group block"
        >
            {/* Image container - portrait aspect ratio (3:4) */}
            <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden mb-4">
                {primaryImage ? (
                    <Image
                        src={primaryImage.url}
                        alt={product.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-neutral-300">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1}
                            stroke="currentColor"
                            className="w-12 h-12"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                            />
                        </svg>
                    </div>
                )}
            </div>

            {/* Product info */}
            <div className={variant === "compact" ? "space-y-1" : "space-y-2"}>
                <h3 className="text-sm font-medium text-neutral-800 group-hover:text-neutral-600 transition-colors line-clamp-1">
                    {product.title}
                </h3>
                <p className="text-sm text-neutral-600">
                    {formatPrice(product.price, product.currency)}
                </p>
            </div>
        </Link>
    );
}
