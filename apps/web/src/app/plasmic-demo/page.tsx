"use client";

import { CartProvider } from "@/components/storefront";
import { CartDrawer } from "@/components/storefront";
import { PlasmicStorefrontTemplate } from "@/components/plasmic/PlasmicStorefrontTemplate";

/**
 * Demo page that renders the Plasmic storefront template programmatically.
 * 
 * Visit: http://localhost:3000/plasmic-demo
 * 
 * This demonstrates how the storefront looks using all the Plasmic
 * code components without needing to use Plasmic Studio drag-and-drop.
 */
export default function PlasmicDemoPage() {
    return (
        <CartProvider>
            <PlasmicStorefrontTemplate
                storeSlug="demo"
            // You can also pass a custom hero background image:
            // heroBackgroundImage="https://your-blob-url.vercel-storage.com/demo/hero.jpg"
            />
            <CartDrawer />
        </CartProvider>
    );
}
