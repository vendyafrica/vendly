"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@vendly/ui/components/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    StarIcon,
    MinusSignIcon,
    PlusSignIcon,
    Loading03Icon,
    Tick02Icon,
    FlashIcon,
} from "@hugeicons/core-free-icons";
import { Avatar, AvatarImage, AvatarFallback } from "@vendly/ui/components/avatar";
import { useCart } from "../../../contexts/cart-context";

interface ProductDetailsProps {
    product: {
        id: string;
        slug: string;
        name: string;
        description?: string | null;
        price: number;
        currency: string;
        images: string[];
        videos?: string[];
        rating: number;
        store: {
            id: string;
            name: string;
            slug: string;
        };
    };
}

export function ProductDetails({ product }: ProductDetailsProps) {
    const router = useRouter();
    const { addItem } = useCart();

    const [quantity, setQuantity] = useState(1);
    const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
    const [isAdded, setIsAdded] = useState(false);

    const [selectedSize, setSelectedSize] = useState<string>("");
    const sizes = ["XS", "S", "M", "L", "XL", "1X", "2X", "3X"];

    // Removed fetching logic as data is passed via props

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
                slug: product.slug,
            },
            store: {
                id: product.store.id,
                name: product.store.name,
                slug: product.store.slug,
            },
        }, quantity);

        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    const handleBuyNow = () => {
        if (!product) return;
        handleAddToCart();
        router.push(`/checkout?storeId=${product.store.id}`);
    };

    // Data is ensured by parent component
    if (!product) return null;

    const validImages = product.images && product.images.length > 0
        ? product.images
        : ["/images/placeholder-product.png"];

    // Ensure we always have 5 images for the gallery layout
    // If we have fewer than 5, we repeat the existing images to fill the slots
    const galleryImages = [...validImages];
    while (galleryImages.length < 5) {
        galleryImages.push(...validImages);
    }
    // Take exactly the first 5
    const displayImages = galleryImages.slice(0, 5);

    const currentImage = displayImages[selectedMediaIndex];

    const handleBack = () => {
        router.back();
    };

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Top Navigation */}
            <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                    <HugeiconsIcon icon={MinusSignIcon} size={16} className="rotate-90" />
                    Back
                </button>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12 lg:gap-20 px-4 lg:px-8">
                {/* Left: Gallery */}
                <div className="flex flex-col-reverse lg:flex-row gap-4 lg:gap-6">
                    {/* Thumbnails - Vertical on desktop, horizontal/grid on mobile */}
                    <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 w-full lg:w-20 shrink-0 scrollbar-hide">
                        {displayImages.map((img, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedMediaIndex(index)}
                                onMouseEnter={() => setSelectedMediaIndex(index)}
                                className={`
                                    relative w-16 h-20 lg:w-full lg:h-24 shrink-0 overflow-hidden border transition-all duration-300
                                    ${selectedMediaIndex === index
                                        ? "border-neutral-900 opacity-100"
                                        : "border-transparent opacity-70 hover:opacity-100 hover:border-neutral-200"
                                    }
                                `}
                            >
                                <Image
                                    src={img}
                                    alt={`View ${index + 1}`}
                                    fill
                                    sizes="100px"
                                    className="object-cover"
                                />
                            </button>
                        ))}
                    </div>

                    {/* Main Image */}
                    <div className="flex-1 relative aspect-4/5 bg-neutral-50 overflow-hidden">
                        <Image
                            src={currentImage}
                            alt={product.name}
                            fill
                            sizes="(max-width: 1024px) 100vw, 60vw"
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>

                {/* Right: Product Details */}
                <div className="flex flex-col pt-2 lg:pl-10">
                    {/* Store Info */}
                    <div className="flex items-center gap-3 mb-8">
                        <Avatar className="h-8 w-8">
                            <AvatarImage
                                src="https://github.com/shadcn.png"
                                alt={product.store.name}
                            />
                            <AvatarFallback>{product.store.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-medium text-neutral-900">{product.store.name}</p>
                            <div className="flex items-center gap-1">
                                <HugeiconsIcon icon={StarIcon} size={12} className="fill-neutral-900 text-neutral-900" />
                                <span className="text-xs text-neutral-500">{product.rating.toFixed(1)} Rating</span>
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-xl lg:text-xl font-normal text-neutral-900 leading-tight mb-2">
                        {product.name}
                    </h1>

                    {/* Price */}
                    <div className="text-md text-neutral-900 mb-8 font-medium">
                        {product.currency} {product.price.toLocaleString()}
                    </div>

                    {/* Description */}
                    {product.description && (
                        <div className="mb-10 text-sm leading-relaxed text-neutral-600 max-w-sm">
                            <p>{product.description}</p>
                        </div>
                    )}

                    {/* Size Selector */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-sm font-medium text-neutral-900">Size</span>
                            <span className="text-sm text-neutral-300">|</span>
                            <button className="text-sm text-neutral-600 underline decoration-neutral-300 underline-offset-4 hover:text-neutral-900 transition-colors">
                                View Size Guide
                            </button>
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
                                        Added to Cart
                                    </span>
                                ) : (
                                    "Add to Cart"
                                )}
                            </Button>
                            <Button
                                onClick={handleBuyNow}
                                variant="outline"
                                className="w-full h-12 rounded-md border border-neutral-200 text-neutral-900 hover:bg-neutral-50 hover:border-primary/50 focus-visible:border-primary/50 focus-visible:ring-[3px] focus-visible:ring-primary/10 uppercase text-xs tracking-wider"
                            >
                                Buy Now
                            </Button>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}