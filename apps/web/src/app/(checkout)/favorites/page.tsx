"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@vendly/ui/components/button";
import { ShoppingBag02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const FAVORITES_BY_STORE = [
    {
        storeName: "My Custom Store",
        storeId: "store_123",
        items: [
            {
                id: "1",
                title: "Classic Trench Coat",
                price: 250,
                image: "/images/trench-coat.png",
            }
        ]
    },
    {
        storeName: "Nike",
        storeId: "store_456",
        items: [
            {
                id: "2",
                title: "Air Force 1",
                price: 120,
                image: "/images/shoes.png",
            },
            {
                id: "4",
                title: "Tech Fleece Hoodie",
                price: 110,
                image: "/images/jacket.png", // Assuming this image exists or using placeholder
            }
        ]
    },
    {
        storeName: "Gucci",
        storeId: "store_789",
        items: [
            {
                id: "3",
                title: "Leather Loafers",
                price: 650,
                image: "/images/leather-loafers.png",
            }
        ]
    },
];

export default function FavoritesPage() {
    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-semibold font-serif">Your Wishlist</h1>
            </div>

            <div className="space-y-12">
                {FAVORITES_BY_STORE.map((storeGroup) => (
                    <div key={storeGroup.storeId} className="border-b border-neutral-100 pb-12 last:border-0 last:pb-0">
                        {/* Store Header */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-sm font-bold text-neutral-500">
                                {storeGroup.storeName.charAt(0)}
                            </div>
                            <h2 className="text-lg font-medium text-black">{storeGroup.storeName}</h2>
                            <Link href="#" className="text-xs text-neutral-400 hover:text-black hover:underline ml-auto">
                                Visit Store
                            </Link>
                        </div>

                        {/* Items Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {storeGroup.items.map((item) => (
                                <div key={item.id} className="group relative">
                                    {/* Image Container */}
                                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-neutral-100 mb-4">
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            className="object-cover mix-blend-multiply group-hover:scale-105 transition duration-500"
                                        />
                                        {/* Overlay Button */}
                                        <div className="absolute inset-x-4 bottom-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                            <Button className="w-full bg-white text-black hover:bg-neutral-50 shadow-lg rounded-full h-11 border border-neutral-100">
                                                <HugeiconsIcon icon={ShoppingBag02Icon} size={18} className="mr-2" />
                                                Add to Cart
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div>
                                        <h3 className="text-base font-medium text-black group-hover:text-neutral-600 transition truncate">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm font-medium text-black mt-1">${item.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {FAVORITES_BY_STORE.length === 0 && (
                <div className="text-center py-24">
                    <p className="text-neutral-500 text-lg">Your wishlist is empty.</p>
                    <Link href="/" className="inline-block mt-4 text-black underline">
                        Continue Shopping
                    </Link>
                </div>
            )}
        </div>
    );
}
