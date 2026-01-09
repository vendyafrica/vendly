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
    sectionTitle?: string;
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
    sectionTitle = "SHOP THE COLLECTION",
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

    // Star rating component
    const StarRating = ({ rating = 5 }: { rating?: number }) => (
        <div style={{ display: "flex", gap: "2px", marginTop: "0.5rem" }}>
            {[...Array(5)].map((_, i) => (
                <svg
                    key={i}
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill={i < rating ? "#1a1a1a" : "none"}
                    stroke="#1a1a1a"
                    strokeWidth="2"
                >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
            ))}
        </div>
    );

    return (
        <div className={className}>
            {/* Section Title */}
            {sectionTitle && (
                <div
                    style={{
                        textAlign: "center",
                        padding: "4rem 2rem 2rem",
                        borderTop: "1px solid rgba(0,0,0,0.08)",
                    }}
                >
                    <h2
                        style={{
                            fontSize: "0.8125rem",
                            fontWeight: 600,
                            letterSpacing: "2px",
                            textTransform: "uppercase",
                            color: "#1a1a1a",
                        }}
                    >
                        {sectionTitle}
                    </h2>
                </div>
            )}

            {/* Products Grid - Responsive columns */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(auto-fill, minmax(250px, 1fr))`,
                    gap: "2rem",
                    padding: "2rem 3rem 4rem",
                    maxWidth: "1400px",
                    margin: "0 auto",
                }}
            >
                {products.slice(0, limit).map((product) => (
                    <div
                        key={product.id}
                        style={{
                            cursor: "pointer",
                            transition: "transform 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-8px)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                        }}
                    >
                        {/* Product Image - Fixed Square Container */}
                        <div
                            style={{
                                position: "relative",
                                width: "100%",
                                aspectRatio: "1 / 1",
                                backgroundColor: "#f5f5f5",
                                marginBottom: "1rem",
                                overflow: "hidden",
                                borderRadius: "4px",
                            }}
                        >
                            {product.imageUrl ? (
                                <Image
                                    src={product.imageUrl}
                                    alt={product.name}
                                    fill
                                    sizes="(max-width: 768px) 50vw, 250px"
                                    style={{
                                        objectFit: "cover",
                                        objectPosition: "center",
                                    }}
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
                                        fontSize: "0.875rem",
                                    }}
                                >
                                    No Image
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div style={{ textAlign: "center" }}>
                            <h3
                                style={{
                                    fontSize: "0.875rem",
                                    fontWeight: 400,
                                    marginBottom: "0.375rem",
                                    color: "#1a1a1a",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {product.name}
                            </h3>
                            <p
                                style={{
                                    fontSize: "0.875rem",
                                    fontWeight: 600,
                                    color: "#1a1a1a",
                                    marginBottom: "0.25rem",
                                }}
                            >
                                {formatPrice(product.basePriceAmount, product.baseCurrency)}
                            </p>
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <StarRating rating={5} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
