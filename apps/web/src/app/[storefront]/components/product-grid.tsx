"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ProductCard } from './product-card';
import { ProductGridSkeleton } from "./skeletons";

interface Product {
    id: string;
    slug: string;
    name: string;
    price: number;
    currency: string;
    image: string | null;
    rating: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Fallback images when no product image
const FALLBACK_IMAGES = [
    "/images/trench-coat.png",
    "/images/navy-blazer.png",
    "/images/leather-loafers.png",
    "/images/linen-shirt.png",
    "/images/cable-knit-sweater.png",
    "/images/tortoiseshell-sunglasses.png",
];

export function ProductGrid() {
    const params = useParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            const slug = params?.storefront as string;
            if (!slug) {
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`${API_BASE}/api/storefront/${slug}/products`);
                if (res.ok) {
                    setProducts(await res.json());
                }
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [params?.storefront]);

    if (loading) return <ProductGridSkeleton />;

    if (products.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-neutral-500">No products available yet.</p>
            </div>
        );
    }

    // Format price for display
    const formatPrice = (amount: number, currency: string) => {
        if (currency === "KES") {
            return `KES ${amount.toLocaleString()}`;
        }
        return `$${(amount / 100).toFixed(2)}`;
    };

    return (
        <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 gap-4 md:gap-5 px-3 sm:px-4 lg:px-6 [column-fill:balance]">
            {products.map((product, index) => (
                <ProductCard
                    key={product.id}
                    index={index}
                    title={product.name}
                    slug={product.slug}
                    price={formatPrice(product.price, product.currency)}
                    image={product.image || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]}
                    rating={product.rating}
                />
            ))}
        </div>
    );
}