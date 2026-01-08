"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Product {
    id: string;
    name: string;
    price: string;
    imageUrl?: string;
    slug: string;
}

export interface FashionProductGridProps {
    title?: string;
    showTitle?: boolean;
    columns?: 3 | 4;
    storeSlug: string;
}

export function FashionProductGrid({
    title = "New Arrivals",
    showTitle = true,
    columns = 4,
    storeSlug,
}: FashionProductGridProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProducts() {
            if (!storeSlug) {
                setLoading(false);
                return;
            }

            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
                const res = await fetch(`${apiUrl}/api/storefront/${storeSlug}/products`);

                if (res.ok) {
                    const data = await res.json();
                    setProducts(
                        data.data?.map((p: {
                            id: string;
                            title: string;
                            priceAmount: number;
                            images?: { url: string }[]
                        }) => ({
                            id: p.id,
                            name: p.title,
                            price: (p.priceAmount / 100).toFixed(2),
                            imageUrl: p.images?.[0]?.url,
                            slug: p.id,
                        })) || []
                    );
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, [storeSlug]);

    // Grid columns based on prop
    const gridCols = columns === 3
        ? "grid-cols-2 md:grid-cols-3"
        : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

    // Show placeholders while loading or if no products
    const displayProducts = products.length > 0
        ? products
        : Array.from({ length: 8 }, (_, i) => ({
            id: `placeholder-${i}`,
            name: `Product ${i + 1}`,
            price: "0.00",
            imageUrl: undefined,
            slug: `product-${i}`,
        }));

    return (
        <section data-editable-section="productGrid" className="py-12 md:py-16 bg-white">
            <div className="container mx-auto px-4 lg:px-8">
                {/* Section Title */}
                {showTitle && title && (
                    <h2
                        data-editable="title"
                        className="text-2xl md:text-3xl font-serif font-medium text-center mb-10"
                    >
                        {title}
                    </h2>
                )}

                {/* Loading State */}
                {loading ? (
                    <div className={`grid ${gridCols} gap-4 md:gap-6`}>
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="bg-gray-100 aspect-square rounded mb-3" />
                                <div className="bg-gray-100 h-4 rounded w-3/4 mb-2" />
                                <div className="bg-gray-100 h-4 rounded w-1/4" />
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Product Grid */
                    <div className={`grid ${gridCols} gap-4 md:gap-6`}>
                        {displayProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                storeSlug={storeSlug}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

interface ProductCardProps {
    product: Product;
    storeSlug: string;
}

function ProductCard({ product, storeSlug }: ProductCardProps) {
    const hasImage = !!product.imageUrl;
    const productUrl = `/${storeSlug}/products/${product.slug}`;

    return (
        <Link href={productUrl} className="group block">
            {/* Product Image - Full card, no hover effects */}
            <div className="relative bg-gray-50 rounded-lg overflow-hidden aspect-square mb-3">
                {hasImage ? (
                    <Image
                        src={product.imageUrl!}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                        <svg
                            className="w-16 h-16"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                )}
            </div>

            {/* Product Name - Below card */}
            <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                {product.name}
            </h3>

            {/* Product Price - Below name */}
            <p className="text-sm font-semibold text-gray-900">
                ${product.price}
            </p>
        </Link>
    );
}

export default FashionProductGrid;
