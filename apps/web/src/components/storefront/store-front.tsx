"use client";

import type { StorefrontData } from "@/types/storefront";
import { StorefrontFooter } from "./footer-section";
import { HeroCarousel } from "./hero";
import { NewArrivalsSection } from "./featured-section";
import { AllProductsGrid } from "./products-grid";

interface StorefrontTemplateProps {
    data: StorefrontData;
}

/**
 * Universal Storefront Template
 *
 * This is the single, fixed layout template used by all tenant storefronts.
 * The layout is intentionally minimal and elegant with:
 * - Hero carousel with header bleeding in (no separate background)
 * - New Arrivals horizontal scroll section
 * - All Products grid section
 * - Minimal footer with newsletter and Vendly branding
 *
 * Only tenant-specific data is dynamic:
 * - Store name
 * - Hero images
 * - Products
 */
export function StorefrontTemplate({ data }: StorefrontTemplateProps) {
    const { store, heroImages, products, newArrivals } = data;

    return (
        <div className="min-h-screen bg-[#F9F8F6]">
            {/* Hero Section - includes header */}
            <HeroCarousel
                storeName={store.name}
                heroImages={heroImages}
                autoPlayInterval={5000}
            />

            {/* Main Content */}
            <main>
                {/* New Arrivals Section */}
                <NewArrivalsSection products={newArrivals} />

                {/* All Products Grid */}
                <AllProductsGrid products={products} />
            </main>

            {/* Fixed Footer */}
            <StorefrontFooter storeName={store.name} />
        </div>
    );
}
