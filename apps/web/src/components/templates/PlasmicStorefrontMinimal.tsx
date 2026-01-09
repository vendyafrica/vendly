"use client";

import { StoreHeader } from "@/components/plasmic/StoreHeader";
import { HeroSection } from "@/components/plasmic/HeroSection";
import { ProductsGrid } from "@/components/plasmic/ProductsGrid";
import { FooterSection } from "@/components/plasmic/FooterSection";

interface PlasmicStorefrontMinimalProps {
    storeSlug: string;
    heroBackgroundImage?: string;
}

/**
 * Minimalist Storefront Template
 * 
 * Features:
 * - Logo on the left
 * - Centered navigation
 * - Larger product cards (3 columns)
 * - Cleaner, more whitespace
 */
export function PlasmicStorefrontMinimal({
    storeSlug,
    heroBackgroundImage,
}: PlasmicStorefrontMinimalProps) {
    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#fff" }}>
            {/* Minimal Header: Logo Left, Nav Center */}
            <StoreHeader
                storeSlug={storeSlug}
                showCart={true}
                variant="minimal"
                className="minimal-header"
            />

            {/* Hero Section */}
            {/* For minimal, maybe we want a smaller hero or different style? 
                For now, reusing standard hero but we could pass variants here too if we updated HeroSection */}
            <HeroSection
                storeSlug={storeSlug}
                backgroundImage={heroBackgroundImage}
            />

            {/* Products Grid - 3 Columns for larger images */}
            <main style={{ flex: 1, padding: "4rem 2rem" }}>
                <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                    <h2 style={{
                        fontSize: "1.5rem",
                        fontWeight: "400",
                        textAlign: "center",
                        marginBottom: "3rem",
                        letterSpacing: "1px",
                        textTransform: "uppercase"
                    }}>
                        Latest Arrivals
                    </h2>
                    <ProductsGrid
                        storeSlug={storeSlug}
                        columns={3}
                        limit={9}
                    />
                </div>
            </main>

            {/* Footer */}
            <FooterSection
                storeSlug={storeSlug}
                showNewsletter={true}
            />
        </div>
    );
}
