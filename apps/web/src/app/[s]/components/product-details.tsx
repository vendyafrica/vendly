"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@vendly/ui/components/button";
import { HugeiconsIcon } from "@hugeicons/react";

import {
    StarIcon,
    MinusSignIcon,
    PlusSignIcon,
    Tick02Icon,
    FlashIcon,
    FavouriteIcon,
} from "@hugeicons/core-free-icons";
import { StoreAvatar } from "@/components/store-avatar";
import { useCart } from "../../../contexts/cart-context";
import { useRecentlyViewed } from "@/hooks/use-recently-viewed";
import { useWishlist } from "@/hooks/use-wishlist";
import { trackStorefrontEvents } from "@/lib/storefront-tracking";

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

    const { addItem } = useCart();
    const { addToRecentlyViewed } = useRecentlyViewed();
    const { toggleWishlist, isInWishlist } = useWishlist();

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

    const [quantity, setQuantity] = useState(1);
    const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);

    const [isAdded, setIsAdded] = useState(false);

    const [selectedSize, setSelectedSize] = useState<string>("");
    const sizes = ["0/24", "1/25", "3/26", "5/27", "7/28", "9/29", "11/30", "13/31", "15/32", "1XL", "2XL", "3XL"];
    const inseams = ["30\"", "32\"", "34\""];
    const [selectedInseam, setSelectedInseam] = useState<string>("");

    const normalizedCategories = (storeCategories || []).map((c) => c.toLowerCase());
    const styleGuideAudience: "men" | "women" | null = normalizedCategories.includes("women")
        ? "women"
        : normalizedCategories.includes("men")
            ? "men"
            : null;

    const handleQuantityChange = (delta: number) => {
        setQuantity(prev => Math.max(1, prev + delta));
    };

    const handleAddToCart = () => {
        if (!product) return;

        addItem({
            id: product.id,
            product: {
                id: product.id,
                name: product.name,
                price: product.price,
                currency: product.currency,
                image: product.images[0],
                contentType: product.mediaItems?.[0]?.contentType || undefined,
                slug: product.slug,
            },
            store: {
                id: product.store.id,
                name: product.store.name,
                slug: product.store.slug,
                logoUrl: product.store.logoUrl,
            },
        }, quantity);

        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    const wishlisted = isInWishlist(product.id);

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
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-10 lg:gap-16 px-4 lg:px-8">
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
                <div className="flex flex-col pt-2 lg:pl-6">

                    {/* Store Info */}
                    <div className="flex items-center gap-3 mb-8">
                        <StoreAvatar
                            storeName={product.store.name}
                            logoUrl={product.store.logoUrl}
                            size="md"
                        />

                        <div>
                            <p className="text-sm font-medium text-neutral-900">{product.store.name}</p>
                            <div className="flex items-center gap-1">
                                <HugeiconsIcon icon={StarIcon} size={12} className="fill-neutral-900 text-neutral-900" />
                                <span className="text-xs text-neutral-500">{ratingValue.toFixed(1) !== "NaN" ? ratingValue.toFixed(1) : "0.0"} Rating</span>
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-xl lg:text-xl font-normal text-neutral-900 leading-tight mb-2">
                        {product.name}
                    </h1>

                    {/* Price */}
                    <div className="text-md text-neutral-900 mb-6 font-medium">
                        {product.currency} {product.price.toLocaleString()}
                    </div>

                    {/* Description */}
                    {product.description && (
                        <div className="mb-6 text-sm leading-relaxed text-neutral-600 max-w-sm">
                            <p>{product.description}</p>
                        </div>
                    )}

                    {/* Size Selector */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-sm font-medium text-neutral-900">Size</span>
                            <span className="text-sm text-neutral-300">|</span>
                            {styleGuideAudience && (
                                <button className="text-sm text-neutral-600 underline decoration-neutral-300 underline-offset-4 hover:text-neutral-900 transition-colors">
                                    View Size Guide
                                </button>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {sizes.map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`
                                        h-10 px-4 min-w-12 border flex items-center justify-center text-sm font-medium transition-all duration-200

                                        ${selectedSize === size
                                            ? "border-neutral-900 bg-neutral-900 text-white"
                                            : "border-neutral-200 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
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
                        <div className="mt-3">
                            <div className="text-sm font-medium text-neutral-900 mb-2">Inseam</div>
                            <div className="flex flex-wrap gap-2">
                                {inseams.map((inseam) => (
                                    <button
                                        key={inseam}
                                        onClick={() => setSelectedInseam(inseam)}
                                        className={`
                                            h-10 px-4 min-w-12 border flex items-center justify-center text-sm font-medium transition-all duration-200
                                            ${selectedInseam === inseam
                                                ? "border-neutral-900 bg-neutral-900 text-white"
                                                : "border-neutral-200 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
                                            }
                                        `}
                                    >
                                        {inseam}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="max-w-sm mt-2">
                        {/* Quantity */}
                        <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
                            <span className="text-sm text-neutral-600">Quantity</span>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => handleQuantityChange(-1)}
                                    className="p-1 hover:text-neutral-900 text-neutral-500 transition-colors"
                                >
                                    <HugeiconsIcon icon={MinusSignIcon} size={16} />
                                </button>
                                <span className="text-sm font-medium w-4 text-center">{quantity}</span>
                                <button
                                    onClick={() => handleQuantityChange(1)}
                                    className="p-1 hover:text-neutral-900 text-neutral-500 transition-colors"
                                >
                                    <HugeiconsIcon icon={PlusSignIcon} size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="grid gap-3 pt-4">
                            <Button
                                onClick={handleAddToCart}
                                className="w-full h-12 rounded-md bg-primary text-white hover:bg-primary/80 uppercase text-xs tracking-wider"
                                disabled={isAdded}
                            >
                                {isAdded ? (
                                    <span className="flex items-center gap-2">
                                        <HugeiconsIcon icon={Tick02Icon} size={16} />
                                        Added to Bag
                                    </span>
                                ) : (
                                    "Add to Bag"
                                )}
                            </Button>
                            <button
                                onClick={() => toggleWishlist({
                                    id: product.id,
                                    name: product.name,
                                    price: product.price,
                                    currency: product.currency,
                                    image: product.images?.[0],
                                    contentType: product.mediaItems?.[0]?.contentType || undefined,
                                    store: {
                                        id: product.store.id,
                                        name: product.store.name,
                                        slug: product.store.slug,
                                    },
                                })}
                                className={`h-12 rounded-md border text-sm font-medium transition-all flex items-center justify-center gap-2 ${wishlisted
                                    ? "border-neutral-900 text-neutral-900 bg-neutral-50"
                                    : "border-neutral-200 text-neutral-800 hover:border-neutral-900 hover:text-neutral-900"
                                    }`}
                                aria-pressed={wishlisted}
                            >
                                <HugeiconsIcon icon={FavouriteIcon} size={18} className={wishlisted ? "text-neutral-900" : "text-neutral-600"} />
                                {wishlisted ? "Saved to Wishlist" : "Save to Wishlist"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}