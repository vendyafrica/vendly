"use client";

import { usePlasmicQueryData } from "@plasmicapp/loader-nextjs";
import Image from "next/image";

interface Product {
    id: string;
    name: string;
    description: string | null;
    basePriceAmount: number;
    baseCurrency: string;
    status: string;
    imageUrl?: string;
}

interface ProductsGridProps {
    storeSlug: string;
    columns?: number;
    limit?: number;
    className?: string;
}

/**
 * Displays a grid of products for a store.
 * Fetches products automatically based on storeSlug.
 */
export function ProductsGrid({
    storeSlug,
    columns = 4,
    limit = 12,
    className,
}: ProductsGridProps) {
    const { data: products, isLoading, error } = usePlasmicQueryData<Product[]>(
        `/products/${storeSlug}`,
        async () => {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const resp = await fetch(
                `${apiUrl}/api/storefront/${storeSlug}/products?limit=${limit}`
            );
            if (!resp.ok) {
                throw new Error("Failed to fetch products");
            }
            return resp.json();
        }
    );

    if (isLoading) {
        return (
            <div
                className={className}
                style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${columns}, 1fr)`,
                    gap: "1.5rem",
                    padding: "2rem",
                }}
            >
                {Array.from({ length: limit }).map((_, i) => (
                    <div
                        key={i}
                        className="animate-pulse"
                        style={{
                            backgroundColor: "#f3f4f6",
                            borderRadius: "0.5rem",
                            height: "300px",
                        }}
                    />
                ))}
            </div>
        );
    }

    if (error || !products) {
        return (
            <div className={className} style={{ padding: "2rem", textAlign: "center" }}>
                <p className="text-red-500">Failed to load products</p>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className={className} style={{ padding: "2rem", textAlign: "center" }}>
                <p className="text-gray-500">No products available</p>
            </div>
        );
    }

    const formatPrice = (amount: number, currency: string) => {
        return new Intl.NumberFormat("en-UG", {
            style: "currency",
            currency: currency || "UGX",
        }).format(amount);
    };

    return (
        <div
            className={className}
            style={{
                display: "grid",
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gap: "1.5rem",
                padding: "2rem",
            }}
        >
            {products.slice(0, limit).map((product) => (
                <div
                    key={product.id}
                    style={{
                        borderRadius: "0.75rem",
                        overflow: "hidden",
                        backgroundColor: "#fff",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        transition: "transform 0.2s, box-shadow 0.2s",
                        cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
                    }}
                >
                    <div
                        style={{
                            position: "relative",
                            width: "100%",
                            paddingTop: "100%",
                            backgroundColor: "#f9fafb",
                        }}
                    >
                        {product.imageUrl ? (
                            <Image
                                src={product.imageUrl}
                                alt={product.name}
                                fill
                                style={{ objectFit: "cover" }}
                            />
                        ) : (
                            <div
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#9ca3af",
                                }}
                            >
                                No Image
                            </div>
                        )}
                    </div>
                    <div style={{ padding: "1rem" }}>
                        <h3
                            style={{
                                fontSize: "0.875rem",
                                fontWeight: 500,
                                marginBottom: "0.5rem",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {product.name}
                        </h3>
                        <p
                            style={{
                                fontSize: "1rem",
                                fontWeight: 600,
                                color: "#111827",
                            }}
                        >
                            {formatPrice(product.basePriceAmount, product.baseCurrency)}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
