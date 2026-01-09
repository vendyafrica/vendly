"use client";

import { usePlasmicQueryData } from "@plasmicapp/loader-nextjs";
import Image from "next/image";
import { ShoppingBag, Menu } from "lucide-react";
import { useState } from "react";

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
    backgroundImage?: string;
    className?: string;
}

/**
 * Store header component with logo, name, and optional cart icon.
 * Responsive design with mobile menu support.
 */
export function StoreHeader({
    storeSlug,
    showCart = true,
    backgroundImage,
    className,
}: StoreHeaderProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
                    padding: "1rem",
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
        <>
            <style jsx>{`
                @media (max-width: 768px) {
                    .header-container {
                        padding: 1rem 1rem !important;
                        position: relative;
                    }
                    .desktop-nav {
                        display: none !important;
                    }
                    .mobile-menu-btn {
                        display: flex !important;
                    }
                    .center-logo {
                        position: static !important;
                        transform: none !important;
                        flex: 1;
                        justify-content: center;
                    }
                    .center-logo span {
                        font-size: 0.9375rem !important;
                    }
                    .actions-section {
                        gap: 0.75rem !important;
                    }
                    .user-icon {
                        display: none !important;
                    }
                    .mobile-menu {
                        display: flex !important;
                    }
                }
            `}</style>


            <header
                className={`header-container ${className || ''}`}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "1.25rem 3rem",
                    backgroundColor: backgroundImage ? "transparent" : "#fff",
                    borderBottom: "1px solid rgba(0,0,0,0.08)",
                    backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "relative",
                }}
            >
                {/* Background overlay for better text readability when image is present */}
                {backgroundImage && (
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            backgroundColor: "rgba(255,255,255,0.9)",
                            zIndex: 0,
                        }}
                    />
                )}
                {/* Mobile Menu Button */}
                <button
                    className="mobile-menu-btn"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    style={{
                        display: "none",
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        color: "#1a1a1a",
                        position: "relative",
                        zIndex: 1,
                    }}
                    aria-label="Toggle menu"
                >
                    <Menu size={24} strokeWidth={2} />
                </button>

                {/* Left Section - Categories (Desktop) */}
                <nav className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: "2rem", position: "relative", zIndex: 1 }}>
                    <a
                        href="#"
                        style={{
                            color: "#1a1a1a",
                            textDecoration: "none",
                            fontSize: "0.8125rem",
                            fontWeight: 400,
                            letterSpacing: "0.5px",
                            textTransform: "uppercase",
                            transition: "color 0.2s",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
                        onMouseLeave={(e) => e.currentTarget.style.color = "#1a1a1a"}
                    >
                        Men
                    </a>
                    <a
                        href="#"
                        style={{
                            color: "#1a1a1a",
                            textDecoration: "none",
                            fontSize: "0.8125rem",
                            fontWeight: 400,
                            letterSpacing: "0.5px",
                            textTransform: "uppercase",
                            transition: "color 0.2s",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
                        onMouseLeave={(e) => e.currentTarget.style.color = "#1a1a1a"}
                    >
                        Women
                    </a>
                    <a
                        href="#"
                        style={{
                            color: "#1a1a1a",
                            textDecoration: "none",
                            fontSize: "0.8125rem",
                            fontWeight: 400,
                            letterSpacing: "0.5px",
                            textTransform: "uppercase",
                            transition: "color 0.2s",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
                        onMouseLeave={(e) => e.currentTarget.style.color = "#1a1a1a"}
                    >
                        Collections
                    </a>
                </nav>

                {/* Center - Store Name/Logo */}
                <div className="center-logo" style={{
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    zIndex: 1,
                }}>
                    <span
                        style={{
                            fontSize: "1.125rem",
                            fontWeight: 600,
                            color: textColor,
                            letterSpacing: "1px",
                            textTransform: "uppercase",
                        }}
                    >
                        {store?.name || "Store"}
                    </span>
                </div>

                {/* Right Section - Actions */}
                <div className="actions-section" style={{ display: "flex", alignItems: "center", gap: "1.5rem", position: "relative", zIndex: 1 }}>
                    <button
                        style={{
                            background: "none",
                            border: "none",
                            padding: 0,
                            cursor: "pointer",
                            color: "#1a1a1a",
                            fontSize: "0.9375rem",
                        }}
                        aria-label="Search"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                    </button>
                    <button
                        className="user-icon"
                        style={{
                            background: "none",
                            border: "none",
                            padding: 0,
                            cursor: "pointer",
                            color: "#1a1a1a",
                            fontSize: "0.9375rem",
                        }}
                        aria-label="Account"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    </button>
                    {showCart && (
                        <button
                            style={{
                                background: "none",
                                border: "none",
                                padding: 0,
                                cursor: "pointer",
                                color: "#1a1a1a",
                                position: "relative",
                            }}
                            aria-label="Shopping cart"
                        >
                            <ShoppingBag size={20} strokeWidth={2} />
                        </button>
                    )}
                </div>
            </header>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
                <nav
                    style={{
                        display: "none",
                        flexDirection: "column",
                        gap: "1rem",
                        padding: "1rem",
                        backgroundColor: "#fff",
                        borderBottom: "1px solid rgba(0,0,0,0.08)",
                    }}
                    className="mobile-menu"
                >
                    <a
                        href="#"
                        style={{
                            color: "#1a1a1a",
                            textDecoration: "none",
                            fontSize: "0.875rem",
                            fontWeight: 400,
                            letterSpacing: "0.5px",
                            textTransform: "uppercase",
                            padding: "0.5rem 0",
                        }}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Men
                    </a>
                    <a
                        href="#"
                        style={{
                            color: "#1a1a1a",
                            textDecoration: "none",
                            fontSize: "0.875rem",
                            fontWeight: 400,
                            letterSpacing: "0.5px",
                            textTransform: "uppercase",
                            padding: "0.5rem 0",
                        }}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Women
                    </a>
                    <a
                        href="#"
                        style={{
                            color: "#1a1a1a",
                            textDecoration: "none",
                            fontSize: "0.875rem",
                            fontWeight: 400,
                            letterSpacing: "0.5px",
                            textTransform: "uppercase",
                            padding: "0.5rem 0",
                        }}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Collections
                    </a>
                </nav >
            )
            }
        </>
    );
}
