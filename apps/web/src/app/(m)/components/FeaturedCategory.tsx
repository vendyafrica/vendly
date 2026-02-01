"use client";

import Link from "next/link";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, StarIcon } from "@hugeicons/core-free-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@vendly/ui/components/avatar";

// Mock data based on the provided image
const products = [
    {
        id: 1,
        storeName: "Comfrt",
        storeHandle: "comfrt",
        logo: "https://ui-avatars.com/api/?name=Comfrt&background=random",
        image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2070&auto=format&fit=crop", // Placeholder
        rating: 4.8,
    },
    {
        id: 2,
        storeName: "Wild Oak Boutique",
        storeHandle: "wild-oak-boutique",
        logo: "https://ui-avatars.com/api/?name=Wild+Oak&background=random",
        image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1973&auto=format&fit=crop", // Jeans placeholder
        rating: 4.7,
    },
    {
        id: 3,
        storeName: "Aviator Nation",
        storeHandle: "aviator-nation",
        logo: "https://ui-avatars.com/api/?name=Aviator+Nation&background=random",
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2020&auto=format&fit=crop",
        rating: 4.5,
    },
    {
        id: 4,
        storeName: "Fashion Nova",
        storeHandle: "fashion-nova",
        logo: "https://ui-avatars.com/api/?name=Fashion+Nova&background=random",
        image: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?q=80&w=2011&auto=format&fit=crop", // Black top
        rating: 4.3,
    },
    {
        id: 5,
        storeName: "Roller Rabbit",
        storeHandle: "roller-rabbit",
        logo: "https://ui-avatars.com/api/?name=Roller+Rabbit&background=random",
        image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=2080&auto=format&fit=crop", // Slippers
        rating: 4.8,
    },
    {
        id: 6,
        storeName: "Zara",
        storeHandle: "zara",
        logo: "https://ui-avatars.com/api/?name=Zara&background=random",
        image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=1974&auto=format&fit=crop", // Dress
        rating: 4.6,
    },
    {
        id: 7,
        storeName: "H&M",
        storeHandle: "hm",
        logo: "https://ui-avatars.com/api/?name=H&M&background=random",
        image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2070&auto=format&fit=crop",// Jacket
        rating: 4.4,
    },
    {
        id: 8,
        storeName: "Shein",
        storeHandle: "shein",
        logo: "https://ui-avatars.com/api/?name=Shein&background=random",
        image: "https://images.unsplash.com/photo-1511556820780-d912e42b4980?q=80&w=1974&auto=format&fit=crop", // Slippers/shoes
        rating: 4.2,
    },
    {
        id: 9,
        storeName: "Uniqlo",
        storeHandle: "uniqlo",
        logo: "https://ui-avatars.com/api/?name=Uniqlo&background=random",
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1976&auto=format&fit=crop", // Dress
        rating: 4.7,
    },
    {
        id: 10,
        storeName: "Adanola",
        storeHandle: "adanola",
        logo: "https://ui-avatars.com/api/?name=Adanola&background=random",
        image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=1974&auto=format&fit=crop", // Sweatshirt
        rating: 4.9,
    },
];

export default function FeaturedCategory() {
    return (
        <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 py-8">
            {/* Header */}
            <div className="flex items-center gap-1 mb-6 cursor-pointer group w-fit">
                <h2 className="text-xl md:text-xl font-semibold">Women</h2>
                <div className=" rounded-full p-1 group-hover:bg-gray-200 transition-colors">
                    <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="text-gray-900" />
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8">
                {products.map((product) => (
                    <div key={product.id} className="flex flex-col gap-3 group cursor-pointer">

                        <div className="relative aspect-3/4 w-full overflow-hidden rounded-md bg-gray-100">
                            <Image
                                src={product.image}
                                alt={product.storeName}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-100" />

                            {/* Store Info Overlay */}
                            <div className="absolute bottom-0 left-0 w-full p-3 flex items-center justify-between">
                                <Link href={`/store/${product.storeHandle}`} className="flex items-center gap-2 overflow-hidden">
                                    <Avatar size="sm" className="border border-white/20 h-6 w-6">
                                        <AvatarImage src={product.logo} alt={product.storeName} />
                                        <AvatarFallback className="bg-white/20 text-white text-[10px]">{product.storeName.slice(0, 1)}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm font-semibold text-white truncate shadow-sm">
                                        {product.storeName}
                                    </span>
                                </Link>

                                <div className="flex items-center gap-1 shrink-0">
                                    <span className="text-sm font-bold text-white shadow-sm">{product.rating}</span>
                                    <HugeiconsIcon icon={StarIcon} size={12} className="text-white fill-white shadow-sm" strokeWidth={0} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
