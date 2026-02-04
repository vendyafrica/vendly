"use client"

import { useState } from "react"
import Link from "next/link"
import { StarIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

// Interface for the dummy product data
export interface ProductType {
    id: string
    title: string
    handle: string
    price: string
    rating: number
    image: string
}

export const dummyProducts: ProductType[] = [
    {
        id: "1",
        title: "Classic White Shirt",
        handle: "classic-white-shirt",
        price: "$89.00",
        rating: 4.5,
        image: "https://ztvqslixzhmasqzz.public.blob.vercel-storage.com/demo/Geoffrey%20-%20Steh%20Kragen%20Hemd%20-%20Wei%C3%9F%20_%20L.jpg"
    },
    {
        id: "2",
        title: "Striped Polo Shirt",
        handle: "striped-polo-shirt",
        price: "$65.00",
        rating: 4.8,
        image: "https://ztvqslixzhmasqzz.public.blob.vercel-storage.com/demo/Men%20Striped%20Trim%20Polo%20Shirt%2C%20Couple%20Things.jpg"
    },
    {
        id: "3",
        title: "Casual Cotton Tee",
        handle: "casual-cotton-tee",
        price: "$45.00",
        rating: 4.3,
        image: "https://ztvqslixzhmasqzz.public.blob.vercel-storage.com/demo/Geoffrey%20-%20Steh%20Kragen%20Hemd%20-%20Wei%C3%9F%20_%20L.jpg"
    },
    {
        id: "4",
        title: "Premium Dress Shirt",
        handle: "premium-dress-shirt",
        price: "$120.00",
        rating: 4.9,
        image: "https://ztvqslixzhmasqzz.public.blob.vercel-storage.com/demo/Men%20Striped%20Trim%20Polo%20Shirt%2C%20Couple%20Things.jpg"
    },
    {
        id: "5",
        title: "Linen Summer Shirt",
        handle: "linen-summer-shirt",
        price: "$75.00",
        rating: 4.6,
        image: "https://ztvqslixzhmasqzz.public.blob.vercel-storage.com/demo/Geoffrey%20-%20Steh%20Kragen%20Hemd%20-%20Wei%C3%9F%20_%20L.jpg"
    },
    {
        id: "6",
        title: "Modern Fit Polo",
        handle: "modern-fit-polo",
        price: "$55.00",
        rating: 4.4,
        image: "https://ztvqslixzhmasqzz.public.blob.vercel-storage.com/demo/Men%20Striped%20Trim%20Polo%20Shirt%2C%20Couple%20Things.jpg"
    },
]

export default function ProductCard({ product }: { product: ProductType }) {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <div
            className="group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link href={`/products/${product.handle}`}>
                <div className="relative aspect-square overflow-hidden bg-muted mb-3">
                    <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Add to Cart Button - Shows on Hover */}
                    <div
                        className={`absolute inset-x-0 bottom-0 p-4 transition-all duration-300 ${isHovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                            }`}
                    >
                        <button
                            className="w-full bg-background text-foreground py-2 px-4 text-sm font-semibold hover:bg-muted transition-colors shadow-lg"
                            onClick={(e) => {
                                e.preventDefault()
                                // Add to cart logic here
                            }}
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </Link>

            {/* Product Info */}
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                    <Link href={`/products/${product.handle}`}>
                        <h3 className="text-sm font-medium text-foreground mb-1 truncate group-hover:text-muted-foreground transition-colors">
                            {product.title}
                        </h3>
                    </Link>
                    <p className="text-sm font-semibold text-foreground">{product.price}</p>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 shrink-0">
                    <HugeiconsIcon icon={StarIcon} size={14} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-xs text-muted-foreground">{product.rating}</span>
                </div>
            </div>
        </div>
    )
}
