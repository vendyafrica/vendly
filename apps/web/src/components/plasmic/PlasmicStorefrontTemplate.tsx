"use client";

import { StoreHeader } from "@/components/plasmic/StoreHeader";
import { HeroSection } from "@/components/plasmic/HeroSection";
import { ProductsGrid } from "@/components/plasmic/ProductsGrid";
import { FooterSection } from "@/components/plasmic/FooterSection";

interface PlasmicStorefrontTemplateProps {
    storeSlug: string;
    heroBackgroundImage?: string;
}

/**
 * Programmatic Plasmic Storefront Template
 * 
 * This renders the store using the Plasmic code components
 * without needing to use Plasmic Studio drag-and-drop.
 * 
 * All components fetch their data automatically from the API.
 */
export function PlasmicStorefrontTemplate({
    storeSlug,
    heroBackgroundImage,
}: PlasmicStorefrontTemplateProps) {
    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            {/* Store Header - Navigation */}
            <StoreHeader
                storeSlug={storeSlug}
                showCart={true}
            />

            {/* Hero Section - Full width banner with background image */}
            <HeroSection
                storeSlug={storeSlug}
                backgroundImage={heroBackgroundImage}
            />

            {/* Products Grid - Fetches from Vercel Blob demo folder */}
            <main style={{ flex: 1 }}>
                <ProductsGrid
                    storeSlug={storeSlug}
                    columns={4}
                    limit={12}
                    sectionTitle="SHOP THE COLLECTION"
                />
            </main>

            {/* Footer - Newsletter and links */}
            <FooterSection
                storeSlug={storeSlug}
                showNewsletter={true}
            />
        </div>
    );
}
