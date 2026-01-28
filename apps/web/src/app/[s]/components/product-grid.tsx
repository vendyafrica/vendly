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

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

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
        <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-3 sm:gap-4 lg:gap-5 px-3 sm:px-4 lg:px-6 xl:px-8 [column-fill:balance]">
            {products.map((product, index) => (
                <ProductCard
                    key={product.id}
                    index={index}
                    title={product.name}
                    slug={product.slug}
                    price={formatPrice(product.price, product.currency)}
                    image={product.image}
                    rating={product.rating}
                />
            ))}
        </div>
    );
}   