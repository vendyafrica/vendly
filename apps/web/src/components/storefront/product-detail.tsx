"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    FavouriteIcon,
    ArrowLeft01Icon,
    ArrowRight01Icon,
    MinusSignIcon,
    Add01Icon
} from "@hugeicons/core-free-icons";
import type { Product } from "@/types/storefront";
import { formatPrice } from "@/lib/storefront-data";
import { StorefrontHeader } from "./header-section";
import { StorefrontFooter } from "./footer-section";
import { ProductCard } from "./product-card";

interface ProductDetailsTemplateProps {
    storeName: string;
    product: Product;
    similarProducts: Product[];
}

export function ProductDetailsTemplate({
    storeName,
    product,
    similarProducts,
}: ProductDetailsTemplateProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);

    const images = product.images.length > 0 ? product.images : [];
    const selectedImage = images[selectedImageIndex] || null;

    const incrementQuantity = () => setQuantity((q) => q + 1);
    const decrementQuantity = () => setQuantity((q) => Math.max(1, q - 1));

    return (
        <div className="min-h-screen bg-[#F9F8F6]">
            {/* Fixed Header - not transparent */}
            <StorefrontHeader storeName={storeName} isTransparent={false} />

            <main className="pt-20">
                {/* Product Details Section */}
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Left: Image Gallery */}
                        <div>
                            {/* Main Image */}
                            <div className="relative aspect-square bg-white mb-4 overflow-hidden">
                                {selectedImage ? (
                                    <Image
                                        src={selectedImage.url}
                                        alt={product.title}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-neutral-300">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1}
                                            stroke="currentColor"
                                            className="w-16 h-16"
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

                            {/* Thumbnail Gallery */}
                            {images.length > 1 && (
                                <div className="flex gap-3 items-center">
                                    <button
                                        onClick={() => setSelectedImageIndex((i) => Math.max(0, i - 1))}
                                        disabled={selectedImageIndex === 0}
                                        className="w-10 h-10 border border-neutral-200 bg-white flex items-center justify-center disabled:opacity-30 hover:border-neutral-400 transition-colors"
                                        aria-label="Previous image"
                                    >
                                        <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
                                    </button>

                                    <div className="flex-1 flex gap-3 overflow-x-auto">
                                        {images.map((img, idx) => (
                                            <button
                                                key={img.id}
                                                onClick={() => setSelectedImageIndex(idx)}
                                                className={`flex-shrink-0 w-20 h-20 border-2 overflow-hidden transition-all ${idx === selectedImageIndex
                                                    ? "border-black"
                                                    : "border-neutral-200 hover:border-neutral-400"
                                                    }`}
                                            >
                                                <Image
                                                    src={img.url}
                                                    alt={`${product.title} thumbnail ${idx + 1}`}
                                                    width={80}
                                                    height={80}
                                                    className="object-cover w-full h-full"
                                                />
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => setSelectedImageIndex((i) => Math.min(images.length - 1, i + 1))}
                                        disabled={selectedImageIndex === images.length - 1}
                                        className="w-10 h-10 border border-neutral-200 bg-white flex items-center justify-center disabled:opacity-30 hover:border-neutral-400 transition-colors"
                                        aria-label="Next image"
                                    >
                                        <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Right: Product Info */}
                        <div>
                            <h1 className="text-2xl md:text-3xl font-medium mb-3">{product.title}</h1>

                            {/* Rating - Static for now */}
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-4 h-4 fill-yellow-400" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <span className="text-xs text-neutral-500">(1 customer review)</span>
                            </div>

                            {/* Price */}
                            <div className="text-2xl font-medium text-red-600 mb-6">
                                {formatPrice(product.price, product.currency)}
                            </div>

                            {/* Description */}
                            <p className="text-sm text-neutral-600 leading-relaxed mb-8">
                                {product.description || "No description available for this product."}
                            </p>

                            {/* Quantity & Add to Cart */}
                            <div className="flex gap-3 mb-6">
                                {/* Quantity Selector */}
                                <div className="flex items-center border border-neutral-200 bg-white">
                                    <button
                                        onClick={decrementQuantity}
                                        className="w-10 h-12 flex items-center justify-center hover:bg-neutral-50 transition-colors"
                                        aria-label="Decrease quantity"
                                    >
                                        <HugeiconsIcon icon={MinusSignIcon} size={16} />
                                    </button>
                                    <div className="w-12 h-12 flex items-center justify-center border-x border-neutral-200 text-sm font-medium">
                                        {quantity}
                                    </div>
                                    <button
                                        onClick={incrementQuantity}
                                        className="w-10 h-12 flex items-center justify-center hover:bg-neutral-50 transition-colors"
                                        aria-label="Increase quantity"
                                    >
                                        <HugeiconsIcon icon={Add01Icon} size={16} />
                                    </button>
                                </div>

                                {/* Add to Cart Button */}
                                <button className="flex-1 h-12 bg-black text-white text-sm font-medium tracking-wide hover:bg-neutral-800 transition-colors">
                                    ADD TO CART
                                </button>
                            </div>

                            {/* Wishlist & Compare */}
                            <div className="flex gap-4 mb-8 text-sm">
                                <button className="flex items-center gap-2 text-neutral-600 hover:text-black transition-colors">
                                    <HugeiconsIcon icon={FavouriteIcon} size={18} />
                                    Browse Wishlist
                                </button>
                                <button className="flex items-center gap-2 text-neutral-600 hover:text-black transition-colors">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    Add to compare
                                </button>
                            </div>

                            {/* Meta Info */}
                            <div className="border-t border-neutral-200 pt-6 space-y-2 text-sm">
                                <div className="text-neutral-600">
                                    <span className="font-medium text-neutral-800">Categories:</span> Clothing, Fashion
                                </div>
                                <div className="text-neutral-600">
                                    <span className="font-medium text-neutral-800">Tag:</span> sneaker
                                </div>
                            </div>

                            {/* Social Share */}
                            <div className="border-t border-neutral-200 mt-6 pt-6">
                                <div className="flex items-center gap-3 text-sm">
                                    <span className="font-medium text-neutral-800">Share this product:</span>
                                    <div className="flex gap-2">
                                        {["F", "T", "P", "G+", "in"].map((icon) => (
                                            <button
                                                key={icon}
                                                className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-black transition-colors"
                                                aria-label={`Share on ${icon}`}
                                            >
                                                {icon}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Similar Products Section */}
                {similarProducts.length > 0 && (
                    <div className="border-t border-neutral-200 py-16">
                        <div className="max-w-7xl mx-auto px-6">
                            <h2 className="text-xl md:text-2xl font-medium tracking-tight mb-10">Similar Products</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
                                {similarProducts.map((prod) => (
                                    <ProductCard key={prod.id} product={prod} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <StorefrontFooter storeName={storeName} />
        </div>
    );
}
