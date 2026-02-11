"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";

import {
    StarIcon,
    FlashIcon,
} from "@hugeicons/core-free-icons";
import { StoreAvatar } from "@/components/store-avatar";
import { useRecentlyViewed } from "@/hooks/use-recently-viewed";
import { trackStorefrontEvents } from "@/lib/storefront-tracking";
import { ProductActions } from "./product-actions";
import { Bricolage_Grotesque } from "next/font/google";

const geistSans = Bricolage_Grotesque({
  variable: "--font-bricolage-grotesque",
  subsets: ["latin"],
});


interface ProductDetailsProps {
    product: {
        id: string;
        slug: string;
        name: string;
        description?: string | null;
        price: number;
        currency: string;
        images: string[];
        mediaItems?: { url: string; contentType?: string | null }[];
        videos?: string[];
        rating?: number;
        store: {
            id: string;
            name: string;
            slug: string;
            logoUrl?: string | null;
        };
    };
    storeCategories?: string[];
}

export function ProductDetails({ product, storeCategories = [] }: ProductDetailsProps) {

    const { addToRecentlyViewed } = useRecentlyViewed();

    useEffect(() => {
        if (!product?.store?.slug || !product?.id) return;
        void trackStorefrontEvents(product.store.slug, [
            {
                eventType: "product_view",
                productId: product.id,
                meta: { productSlug: product.slug },
            },
        ]);
    }, [product]);

    useEffect(() => {
        if (product) {
            addToRecentlyViewed({
                id: product.id,
                name: product.name,
                price: product.price,
                currency: product.currency,
                image: product.images[0] || "",
                contentType: product.mediaItems?.[0]?.contentType || undefined,
                store: {
                    name: product.store.name,
                    slug: product.store.slug,
                },
                slug: product.slug,
            });
        }
    }, [product, addToRecentlyViewed]);

    const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);

    const [selectedSize, setSelectedSize] = useState<string>("");
    const sizes = ["0/24", "1/25", "3/26", "5/27", "7/28", "9/29", "11/30", "13/31", "15/32", "1XL", "2XL", "3XL"];

    const normalizedCategories = (storeCategories || []).map((c) => c.toLowerCase());
    const styleGuideAudience: "men" | "women" | null = normalizedCategories.includes("women")
        ? "women"
        : normalizedCategories.includes("men")
            ? "men"
            : null;

    const ratingValue = typeof product.rating === "number" && Number.isFinite(product.rating)
        ? product.rating
        : 0;

    const FALLBACK_PRODUCT_IMAGE = "https://cdn.cosmos.so/25e7ef9d-3d95-486d-b7db-f0d19c1992d7?format=jpeg";

    const validImages = product.images && product.images.length > 0
        ? product.images.filter(Boolean)
        : [FALLBACK_PRODUCT_IMAGE];

    // Only show the real images/variants without padding or duplication
    const displayImages = Array.from(new Set(validImages));

    const safeSelectedIndex = Math.min(selectedMediaIndex, displayImages.length - 1);
    const currentImage = displayImages[safeSelectedIndex] ?? displayImages[0];

    return (
        <div className="min-h-screen bg-white pb-20" suppressHydrationWarning>
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-10 lg:gap-16 px-2 sm:px-4 lg:px-8">
                {/* Left: Gallery */}
                <div className="flex flex-col gap-4">
                    {/* Mobile carousel */}
                    <div className="lg:hidden flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-hide">
                        {displayImages.map((img, index) => (
                            <div key={index} className="relative min-w-[78%] aspect-3/4 snap-center rounded-xl overflow-hidden bg-neutral-50">
                                <Image
                                    src={img}
                                    alt={`${product.name} ${index + 1}`}

                                    fill
                                    sizes="90vw"
                                    className="object-cover"
                                    priority={index === 0}
                                    unoptimized={img.includes("blob.vercel-storage.com")}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Desktop thumbs + main */}
                    <div className="hidden lg:flex flex-row gap-6">
                        <div className="flex flex-col gap-3 w-20 shrink-0">
                            {displayImages.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedMediaIndex(index)}
                                    onMouseEnter={() => setSelectedMediaIndex(index)}
                                    className={`
                                        relative w-full h-24 overflow-hidden border transition-all duration-300 rounded-md
                                        ${safeSelectedIndex === index
                                            ? "border-neutral-900 opacity-100"
                                            : "border-transparent opacity-70 hover:opacity-100 hover:border-neutral-200"
                                        }
                                    `}
                                >
                                    <Image
                                        src={img}
                                        alt={`View ${index + 1}`}
                                        fill
                                        sizes="120px"
                                        className="object-cover"
                                        unoptimized={img.includes("blob.vercel-storage.com")}
                                    />
                                </button>
                            ))}
                        </div>

                        <div className="flex-1 relative aspect-4/5 bg-neutral-50 overflow-hidden rounded-xl">
                            <Image
                                src={currentImage}
                                alt={product.name}
                                fill
                                sizes="(max-width: 1024px) 100vw, 60vw"
                                className="object-cover"
                                priority
                                unoptimized={currentImage.includes("blob.vercel-storage.com")}
                            />
                        </div>
                    </div>
                </div>

                {/* Right: Product Details */}
                <div className="flex flex-col pt-2 lg:pt-0 lg:pl-6">

                    {/* Store Info - Header */}
                    <div className="flex items-start justify-between mb-6 gap-4">
                        <div className="flex items-start gap-3">
                            <StoreAvatar
                                storeName={product.store.name}
                                logoUrl={product.store.logoUrl}
                                size="md"
                            />
                            <div>
                                <p className={` ${geistSans.className} text-md font-semibold text-neutral-900 capitalize`}>{product.store.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                            <HugeiconsIcon icon={StarIcon} size={14} className="fill-neutral-900 text-neutral-900" />
                            <span className="text-sm font-medium text-neutral-900">
                                {ratingValue.toFixed(1) !== "NaN" ? ratingValue.toFixed(1) : "0.0"}
                            </span>
                            <span className="text-sm text-neutral-500">
                                ({ratingValue > 0 ? "429.2K" : "0"})
                            </span>
                        </div>
                    </div>

                    {/* Product Name */}
                    <h1 className="text-2xl lg:text-2xl font-semibold text-neutral-900 leading-tight mb-3">
                        {product.name}
                    </h1>

                    {/* Price */}
                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-md lg:text-lg font-bold text-neutral-900">
                            {product.currency} {product.price.toLocaleString()}
                        </span>
                        {/* Optional: Add strikethrough price if you have original price */}
                        {/* <span className="text-sm text-neutral-400 line-through">
                            {product.currency} {(product.price * 2).toLocaleString()}
                        </span>
                        <span className="px-2.5 py-1 bg-neutral-900 text-white text-sm font-semibold rounded-full">
                            50% off
                        </span> */}
                    </div>
                    <h2 className="text-md font-semibold mb-1">Description</h2>
                    {/* Description */}
                    {product.description && (
                        <div className="mb-8 text-base leading-relaxed text-neutral-600 max-w-lg">
                            <p>{product.description}</p>
                        </div>
                    )}

                    {/* Style Section */}
                    <div className="mb-8">
                        {/* Size */}
                        <div className="mb-2">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-medium text-neutral-900">Size {selectedSize && <span className="text-neutral-500">{selectedSize}</span>}</span>
                                {styleGuideAudience && (
                                    <button className="text-sm text-neutral-600 underline hover:text-neutral-900 transition-colors">
                                        Size Guide
                                    </button>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`
                                            h-9 px-2 min-w-[3.5rem] cursor-pointer border-1 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200

                                            ${selectedSize === size
                                                ? "border-neutral-900 bg-neutral-900 text-white"
                                                : "border-neutral-200 text-neutral-900 hover:border-neutral-400"
                                            }
                                        `}
                                    >
                                        {size === "2X" && (
                                            <HugeiconsIcon
                                                icon={FlashIcon}
                                                size={12}
                                                className={`mr-1.5 ${selectedSize === size ? "text-yellow-400" : "text-yellow-500"}`}
                                            />
                                        )}
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <ProductActions product={product} />
                </div>
            </div>
        </div>
    );
}
