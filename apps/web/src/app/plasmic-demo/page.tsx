"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CartProvider } from "@/components/storefront";
import { CartDrawer } from "@/components/storefront";
import { PlasmicStorefrontTemplate } from "@/components/plasmic/PlasmicStorefrontTemplate";

/**
 * Demo page that renders the Plasmic storefront template programmatically.
 * 
 * Visit: http://localhost:3000/plasmic-demo?store=your-slug
 * 
 * This demonstrates how the storefront looks using all the Plasmic
 * code components without needing to use Plasmic Studio drag-and-drop.
 */
function PlasmicDemoContent() {
    const searchParams = useSearchParams();
    // Default to 'demo' if no store param is provided
    const storeSlug = searchParams.get("store") || "demo";

    return (
        <CartProvider>
            <PlasmicStorefrontTemplate
                storeSlug={storeSlug}
            // You can also pass a custom hero background image:
            // heroBackgroundImage="https://your-blob-url.vercel-storage.com/demo/hero.jpg"
            />
            <CartDrawer />
        </CartProvider>
    );
}

export default function PlasmicDemoPage() {
    return (
        <Suspense fallback={<div>Loading demo...</div>}>
            <PlasmicDemoContent />
        </Suspense>
    );
}
