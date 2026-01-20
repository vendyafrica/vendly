"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@vendly/ui/components/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    StarIcon,
    FavouriteIcon,
    Share01Icon,
    MinusSignIcon,
    PlusSignIcon,
    Tick01Icon
} from "@hugeicons/core-free-icons";

import { Avatar, AvatarImage, AvatarFallback } from "@vendly/ui/components/avatar";

export function ProductDetails() {
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState("green");

    const colors = [
        { name: "green", class: "bg-[#5D6B35]" }, // Oliveish green
        { name: "brown", class: "bg-[#5C5338]" }, // Brownish
        { name: "dark-green", class: "bg-[#2A4B4E]" }, // Dark Teal
        { name: "purple", class: "bg-[#483C6C]" }, // Deep Purple
    ];

    const handleQuantityChange = (delta: number) => {
        setQuantity(prev => Math.max(1, prev + delta));
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

            {/* Left Column: Images */}
            <div className="space-y-6">
                <div className="relative overflow-hidden aspect-square flex items-center justify-center p-8 group border border-neutral-200">

                    <Image
                        src="/images/green-bottle.png"
                        alt="Eco-Friendly Reusable Water Bottle"
                        width={500}
                        height={600}
                        className="object-contain w-full h-full mix-blend-multiply"
                        priority
                    />

                    {/* Floating Actions */}
                    <div className="absolute top-10 right-10 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button size="icon" variant="secondary" className="rounded-full backdrop-blur-sm shadow-sm h-9 w-9 cursor-pointer">
                            <HugeiconsIcon icon={Share01Icon} size={16} />
                        </Button>
                        <Button size="icon" variant="secondary" className="rounded-full backdrop-blur-sm shadow-sm h-9 w-9 cursor-pointer">
                            <HugeiconsIcon icon={FavouriteIcon} size={16} />
                        </Button>
                    </div>
                </div>

                {/* Thumbnails */}
                <div className="grid grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <button
                            key={i}
                            className="rounded-2xl overflow-hidden aspect-square p-2 border-2 transition-all"
                        >

                            <Image
                                src="/images/green-bottle.png"
                                alt={`View ${i}`}
                                width={100}
                                height={100}
                                className="object-contain w-full h-full mix-blend-multiply"
                            />
                        </button>
                    ))}
                </div>
            </div>

            {/* Right Column: Details */}
            <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-6">
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium tracking-wide">Vendly </p>
                </div>

                <h1 className="text-md font-semibold mb-3 leading-tight">
                    Eco-Friendly Reusable Water Bottle
                </h1>

                <div className="flex items-center justify-between mb-8">
                    <div className="text-md font-semibold">
                        $24.99
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full">
                        <HugeiconsIcon icon={StarIcon} size={16} className="text-[#f7d2c4] fill-[#f7d2c4]" />
                        <span className="font-semibold text-sm">4.5</span>
                        <span className="text-sm">(128 reviews)</span>
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="text-sm font-medium mb-4 tracking-wide">Choose a Color</h3>
                    <div className="flex gap-3">
                        {colors.map((color) => (
                            <button
                                key={color.name}
                                onClick={() => setSelectedColor(color.name)}
                                className="w-6 h-6 rounded-full flex items-center justify-center transition-all"
                            >
                                {selectedColor === color.name && (
                                    <HugeiconsIcon icon={Tick01Icon} size={20} className="text-white stroke-3" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div>

                </div>

                {/* Quantity */}
                <div className="mb-8">
                    <h3 className="text-sm font-medium mb-4 tracking-wide">Quantity</h3>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center rounded-lg p-1 border">
                            <button
                                onClick={() => handleQuantityChange(-1)}
                                className="w-10 h-10 flex items-center justify-center rounded-md"
                            >
                                <HugeiconsIcon icon={MinusSignIcon} size={16} />
                            </button>
                            <div className="w-12 text-center font-semibold text-lg">
                                {quantity}
                            </div>
                            <button
                                onClick={() => handleQuantityChange(1)}
                                className="w-10 h-10 flex items-center justify-center rounded-md"
                            >
                                <HugeiconsIcon icon={PlusSignIcon} size={16} />
                            </button>

                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-4">
                    <Button className="w-full cursor-pointer rounded-xl h-12">
                        Add To Cart
                    </Button>
                    <Button variant="outline" className="w-full rounded-xl h-12 cursor-pointer">
                        Add to Wishlist
                    </Button>
                </div>
            </div>
        </div>

    );
}