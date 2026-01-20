"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@vendly/ui/components/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    StarIcon,
    FavouriteIcon,
    MinusSignIcon,
    PlusSignIcon,
} from "@hugeicons/core-free-icons";
import { Avatar, AvatarImage, AvatarFallback } from "@vendly/ui/components/avatar";

interface ProductDetailsProps {
    slug: string;
}

const getProductData = (slug: string) => {
    const products: Record<string, { title: string; price: number; image: string }> = {
        "classic-trench-coat": {
            title: "Classic Trench Coat",
            price: 299.00,
            image: "/images/trench-coat.png",
        },
        "navy-heritage-blazer": {
            title: "Navy Heritage Blazer",
            price: 249.00,
            image: "/images/navy-blazer.png",
        },
        "penny-loafers": {
            title: "Penny Loafers",
            price: 189.00,
            image: "/images/leather-loafers.png",
        },
        "premium-linen-shirt": {
            title: "Premium Linen Shirt",
            price: 89.00,
            image: "/images/linen-shirt.png",
        },
        "cable-knit-sweater": {
            title: "Cable Knit Sweater",
            price: 129.00,
            image: "/images/cable-knit-sweater.png",
        },
        "tortoiseshell-shades": {
            title: "Tortoiseshell Shades",
            price: 159.00,
            image: "/images/tortoiseshell-sunglasses.png",
        },
        "premium-linen-shirt-blue": {
            title: "Premium Linen Shirt Blue",
            price: 89.00,
            image: "/images/linen-shirt.png",
        },
        "premium-linen-shirt-white": {
            title: "Premium Linen Shirt White",
            price: 89.00,
            image: "/images/linen-shirt.png",
        }
    };

    return products[slug];
};

export function ProductDetails({ slug }: ProductDetailsProps) {
    const product = getProductData(slug);
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState("green");


    const hardcodedBrand = {
        name: "Heritage Co",
        avatar: "/images/brand-avatar.png"
    };
    const hardcodedRating = 4.8;
    const hardcodedReviews = 124;
    const hardcodedColors = [
        { name: "green", class: "bg-[#5D6B35]" },
        { name: "brown", class: "bg-[#5C5338]" },
        { name: "dark-green", class: "bg-[#2A4B4E]" },
    ];

    if (!product) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-medium">Product not found</h2>
            </div>
        );
    }

    const handleQuantityChange = (delta: number) => {
        setQuantity(prev => Math.max(1, prev + delta));
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 min-h-screen px-3 sm:px-4 md:px-8 bg-white">

            {/* Mobile horizontal gallery */}
            <div className="lg:hidden w-full">
                <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="relative shrink-0 w-64 aspect-4/5 bg-[#F0F0F0] rounded-xl overflow-hidden">
                            <Image
                                src={product.image}
                                alt={`${product.title} view ${i}`}
                                fill
                                sizes="256px"
                                className="object-cover mix-blend-multiply"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Desktop sticky gallery */}
            <div className="hidden lg:flex lg:col-span-7 flex-col-reverse md:flex-row gap-4 lg:h-screen lg:sticky lg:top-0 lg:py-8 lg:overflow-hidden">
                <div className="flex md:flex-col gap-3 md:max-h-full w-full md:w-20 lg:w-24 shrink-0 overflow-hidden">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div
                            key={i}
                            className="relative shrink-0 w-20 md:w-full aspect-square bg-[#F0F0F0] rounded-lg overflow-hidden cursor-pointer hover:ring-2 ring-black transition-all"
                        >
                            <Image
                                src={product.image}
                                alt={`${product.title} view ${i}`}
                                fill
                                sizes="100px"
                                className="object-cover mix-blend-multiply"
                            />
                        </div>
                    ))}
                </div>

                {/* Main Product Image */}
                <div className="flex-1 relative overflow-hidden bg-[#F0F0F0] rounded-2xl aspect-4/5 flex items-center justify-center group">
                    <Image
                        src={product.image}
                        alt={product.title}
                        width={800}
                        height={1000}
                        className="object-cover w-full h-full mix-blend-multiply"
                        priority
                    />

                    <div className="absolute top-4 right-4 z-10">
                        <span className="inline-block rounded-sm bg-neutral-300/50 text-neutral-900/80 backdrop-blur-sm px-4 py-2 text-sm font-semibold">
                            ${product.price.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Details column */}
            <div className="lg:col-span-5 h-full lg:h-screen overflow-visible lg:overflow-y-auto pr-0 lg:pr-1">
                <div className="space-y-8 py-3 md:py-4">

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-black/5 w-fit">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={hardcodedBrand.avatar} />
                                    <AvatarFallback>{hardcodedBrand.name.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <span className="text-xs font-semibold tracking-wide uppercase text-neutral-600">{hardcodedBrand.name}</span>
                            </div>

                            <div className="flex items-center gap-1">
                                <Button size="icon" variant="ghost" className="rounded-full h-10 w-10 hover:bg-neutral-100">
                                    <HugeiconsIcon icon={FavouriteIcon} size={24} />
                                </Button>
                            </div>
                        </div>

                        <h1 className="text-xl md:text-xl font-medium tracking-tight text-neutral-900 leading-[1.1]">
                            {product.title}
                        </h1>

                        <div className="flex items-center gap-4">
                            <span className="text-lg font-medium text-neutral-700">${product.price.toFixed(2)}</span>
                            <div className="flex items-center gap-1.5">
                                <HugeiconsIcon icon={StarIcon} size={16} className="text-black fill-black" />
                                <span className="font-medium text-sm">{hardcodedRating}</span>
                                <span className="text-neutral-500 text-sm">({hardcodedReviews} reviews)</span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-px bg-neutral-200" />

                    <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-3 block">Color — {selectedColor}</span>
                        <div className="flex flex-wrap gap-3">
                            {hardcodedColors.map((color) => (
                                <button
                                    key={color.name}
                                    onClick={() => setSelectedColor(color.name)}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all border-2 ${selectedColor === color.name ? "border-black scale-105" : "border-transparent hover:scale-105"
                                        }`}
                                >
                                    <span className={`w-6 h-6 rounded-full block shadow-sm border border-black/5 ${color.class}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4 pt-4">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center border border-neutral-300 rounded-full px-2 py-1">
                                <button
                                    onClick={() => handleQuantityChange(-1)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors"
                                >
                                    <HugeiconsIcon icon={MinusSignIcon} size={16} />
                                </button>
                                <div className="w-10 text-center font-medium text-sm">
                                    {quantity}
                                </div>
                                <button
                                    onClick={() => handleQuantityChange(1)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors"
                                >
                                    <HugeiconsIcon icon={PlusSignIcon} size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            <Button className="w-full rounded-full h-14 text-lg font-medium shadow-xl shadow-neutral-200 hover:shadow-neutral-300 transition-shadow">
                                Add to Cart
                            </Button>
                            <Button variant="outline" className="w-full rounded-full h-14 text-base font-medium border-neutral-300 hover:bg-neutral-50">
                                Buy Now
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}