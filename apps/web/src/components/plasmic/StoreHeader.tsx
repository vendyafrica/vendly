"use client";

import { usePlasmicQueryData } from "@plasmicapp/loader-nextjs";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";

interface StoreData {
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
    theme: {
        primaryColor: string;
        textColor: string;
    };
}

interface StoreHeaderProps {
    storeSlug: string;
    showCart?: boolean;
    className?: string;
}

/**
 * Store header component with logo, name, and optional cart icon.
 */
export function StoreHeader({
    storeSlug,
    showCart = true,
    className,
}: StoreHeaderProps) {
    const { data: store, isLoading } = usePlasmicQueryData<StoreData>(
        `/store-header/${storeSlug}`,
        async () => {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const resp = await fetch(`${apiUrl}/api/storefront/${storeSlug}`);
            if (!resp.ok) {
                throw new Error("Failed to fetch store data");
            }
            return resp.json();
        }
    );

    if (isLoading) {
        return (
            <header
                className={className}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "1rem 2rem",
                    borderBottom: "1px solid #e5e7eb",
                }}
            >
                <div className="animate-pulse" style={{ width: 120, height: 32, backgroundColor: "#f3f4f6", borderRadius: 4 }} />
            </header>
        );
    }

    const primaryColor = store?.theme?.primaryColor || "#1a1a2e";
    const textColor = store?.theme?.textColor || "#1a1a2e";

    return (
        <header
            className={className}
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1rem 2rem",
                borderBottom: "1px solid #e5e7eb",
                backgroundColor: "#fff",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                {store?.logoUrl ? (
                    <Image
                        src={store.logoUrl}
                        alt={store.name}
                        width={40}
                        height={40}
                        style={{ borderRadius: "0.5rem", objectFit: "cover" }}
                    />
                ) : (
                    <div
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: "0.5rem",
                            backgroundColor: primaryColor,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            fontWeight: 600,
                            fontSize: "1.125rem",
                        }}
                    >
                        {store?.name?.charAt(0) || "S"}
                    </div>
                )}
                <span
                    style={{
                        fontSize: "1.25rem",
                        fontWeight: 600,
                        color: textColor,
                    }}
                >
                    {store?.name || "Store"}
                </span>
            </div>

            <nav style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                <a
                    href="#products"
                    style={{
                        color: textColor,
                        textDecoration: "none",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                    }}
                >
                    Products
                </a>
                <a
                    href="#categories"
                    style={{
                        color: textColor,
                        textDecoration: "none",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                    }}
                >
                    Categories
                </a>
                {showCart && (
                    <button
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            border: "none",
                            backgroundColor: primaryColor,
                            color: "#fff",
                            cursor: "pointer",
                        }}
                    >
                        <ShoppingBag size={20} />
                    </button>
                )}
            </nav>
        </header>
    );
}
