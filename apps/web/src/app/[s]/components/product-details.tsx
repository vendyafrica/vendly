"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";

import { StarIcon } from "@hugeicons/core-free-icons";
import { StoreAvatar } from "@/components/store-avatar";
import { useRecentlyViewed } from "@/hooks/use-recently-viewed";
import { trackStorefrontEvents } from "@/lib/storefront-tracking";
import { ProductActions } from "./product-actions";
import { Bricolage_Grotesque } from "next/font/google";
import { getStyleGuideAudience } from "@/lib/constants/style-guide";

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

    const styleGuideAudience = getStyleGuideAudience(storeCategories);

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
        <div className="min-h-screen bg-white pb-24" suppressHydrationWarning>
            <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] xl:grid-cols-[1.8fr_1fr] gap-8 lg:gap-14 xl:gap-20 px-4 sm:px-6 lg:px-10 pt-8 lg:pt-14">
                {/* Left: Gallery */}
                <div className="flex flex-col gap-4">
                    {/* Mobile carousel */}
                    <div className="lg:hidden flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-hide">
                        {displayImages.map((img, index) => (
                            <div
                                key={index}
                                className="relative w-[85vw] sm:w-[70vw] shrink-0 snap-center rounded-none overflow-hidden bg-neutral-100 aspect-3/4 min-h-[320px]"
                                style={{ aspectRatio: "3 / 4" }}
                            >
                                <Image
                                    src={img}
                                    alt={`${product.name} ${index + 1}`}
                                    fill
                                    sizes="90vw"
                                    className="object-cover"
                                    priority={index === 0}
                                    unoptimized={img.includes(".ufs.sh")}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Desktop thumbs + main */}
                    <div className="hidden lg:flex flex-row gap-6 lg:gap-8 h-[75vh] min-h-[600px] max-h-[900px]">
                        <div className="flex flex-col gap-4 w-20 xl:w-24 shrink-0 overflow-y-auto scrollbar-hide">
                            {displayImages.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedMediaIndex(index)}
                                    onMouseEnter={() => setSelectedMediaIndex(index)}
                                    className={`
                                        relative w-full aspect-3/4 overflow-hidden transition-all duration-300
                                        ${safeSelectedIndex === index
                                            ? "ring-1 ring-black opacity-100"
                                            : "opacity-60 hover:opacity-100"
                                        }
                                    `}
                                >
                                    <Image
                                        src={img}
                                        alt={`View ${index + 1}`}
                                        fill
                                        sizes="120px"
                                        className="object-cover"
                                        unoptimized={img.includes(".ufs.sh")}
                                    />
                                </button>
                            ))}
                        </div>

                        <div className="flex-1 relative bg-neutral-100 overflow-hidden h-full">
                            <Image
                                src={currentImage}
                                alt={product.name}
                                fill
                                sizes="(max-width: 1024px) 100vw, 60vw"
                                className="object-cover object-center"
                                priority
                                unoptimized={currentImage.includes(".ufs.sh")}
                            />
                        </div>
                    </div>
                </div>

                {/* Right: Product Details */}
                <div className="flex flex-col pt-6 lg:pt-0 lg:pl-6 max-w-xl">

                    {/* Store Info - Header */}
                    <div className="flex items-start justify-between mb-8 gap-4 pb-6 border-b border-neutral-200">
                        <div className="flex items-center gap-3">
                            <StoreAvatar
                                storeName={product.store.name}
                                logoUrl={product.store.logoUrl}
                                size="md"
                            />
                            <div>
                                <p className={` ${geistSans.className} text-sm tracking-wide font-medium text-neutral-900 uppercase`}>{product.store.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <HugeiconsIcon icon={StarIcon} size={14} className="fill-neutral-900 text-neutral-900" />
                            <span className="text-sm font-medium text-neutral-900">
                                {ratingValue.toFixed(1) !== "NaN" ? ratingValue.toFixed(1) : "0.0"}
                            </span>
                            <span className="text-sm text-neutral-500">
                                ({ratingValue > 0 ? "429.2K" : "0"})
                            </span>
                        </div>
                    </div>

                    {/* Product Name & Price Module */}
                    <div className="mb-10">
                        <h1 className="text-3xl lg:text-4xl font-serif text-neutral-900 leading-tight mb-4 tracking-tight">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-3 mt-2">
                            <span className="text-xl font-medium text-neutral-900">
                                {product.currency} {product.price.toLocaleString(undefined, {
                                    minimumFractionDigits: product.currency === "USD" ? 2 : 0,
                                    maximumFractionDigits: product.currency === "USD" ? 2 : 0,
                                })}
                            </span>
                        </div>
                    </div>

                    {/* Style Section (Size Variants) */}
                    {styleGuideAudience && (
                        <div className="mb-12">
                            <div className="mb-2">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm font-medium text-neutral-900 uppercase tracking-widest">
                                        Size {selectedSize && <span className="text-neutral-500 ml-1">- {selectedSize}</span>}
                                    </span>
                                    <button className="text-xs text-neutral-500 underline hover:text-neutral-900 transition-colors uppercase tracking-widest">
                                        Size Guide
                                    </button>
                                </div>
                                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                                    {sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`
                                                h-12 w-full cursor-pointer border flex items-center justify-center text-sm font-medium transition-all duration-200
                                                ${selectedSize === size
                                                    ? "border-neutral-900 bg-neutral-900 text-white"
                                                    : "border-neutral-300 text-neutral-900 hover:border-neutral-900"
                                                }
                                            `}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="mb-12">
                        <ProductActions product={product} />
                    </div>

                    {/* Description */}
                    {product.description && (
                        <div className="pt-8 border-t border-neutral-200">
                            <h2 className="text-sm font-medium mb-4 uppercase tracking-widest text-neutral-900">Description / Details</h2>
                            <div className="text-sm leading-relaxed text-neutral-600">
                                <p>{product.description}</p>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
