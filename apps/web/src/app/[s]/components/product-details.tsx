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
}

export function ProductDetails({ product }: ProductDetailsProps) {

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
        <div className="min-h-screen bg-white pb-16" suppressHydrationWarning>
            <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] xl:grid-cols-[1.8fr_1fr] gap-4 lg:gap-6 xl:gap-8 px-4 sm:px-6 lg:px-10 pt-0 lg:pt-0 -mt-4">
                {/* Left: Gallery */}
                <div className="flex flex-col gap-3 lg:sticky lg:top-0 lg:self-start lg:h-max">
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
                                    className="object-cover"
                                    priority={index === 0}
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
                                        className="object-cover"
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
                            />
                        </div>
                    </div>
                </div>

                {/* Right: Product Details */}
                <div className="flex flex-col pt-1 lg:pt-0 lg:pl-6 max-w-xl w-full lg:max-w-[520px] xl:max-w-[560px]">

                    {/* Store Info - Header */}
                    <div className="flex items-center justify-between mb-3 mt-0">
                        <div className="flex items-center gap-3">
                            <StoreAvatar
                                storeName={product.store.name}
                                logoUrl={product.store.logoUrl}
                                size="sm"
                            />
                            <div>
                                <p className={` ${geistSans.className} text-base tracking-wide font-medium text-neutral-900`}>{product.store.name}</p>
                            </div>
                        </div>
                    </div>

                    {/* Product Name & Rating */}
                    <div className="mb-6">
                        <h1 className="text-[26px] lg:text-[28px] font-semibold text-neutral-900 leading-snug tracking-tight mb-2">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-1 mb-5">
                            <HugeiconsIcon icon={StarIcon} size={16} className="fill-yellow-400 text-yellow-400" />
                            <HugeiconsIcon icon={StarIcon} size={16} className="fill-yellow-400 text-yellow-400" />
                            <HugeiconsIcon icon={StarIcon} size={16} className="fill-yellow-400 text-yellow-400" />
                            <HugeiconsIcon icon={StarIcon} size={16} className="fill-yellow-400 text-yellow-400" />
                            <HugeiconsIcon icon={StarIcon} size={16} className="fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium text-neutral-900 ml-1">
                                {ratingValue.toFixed(1) !== "NaN" ? ratingValue.toFixed(1) : "0.0"}
                            </span>
                            <span className="text-sm text-neutral-600 underline ml-1 cursor-pointer">
                                {ratingValue > 0 ? "473 ratings" : "0 ratings"}
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-2xl font-bold text-neutral-900">
                                {product.currency} {product.price.toLocaleString(undefined, {
                                    minimumFractionDigits: product.currency === "USD" ? 2 : 0,
                                    maximumFractionDigits: product.currency === "USD" ? 2 : 0,
                                })}
                            </span>
                        </div>
                    </div>
                    {/* Actions */}
                    <div className="mb-8 w-full max-w-[460px]">
                        <ProductActions product={product} />
                    </div>

                    {product.description && (
                        <div className="border-t border-neutral-100 pt-5">
                            <h2 className="text-sm font-medium mb-3 uppercase tracking-widest text-neutral-900">Description / Details</h2>
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
