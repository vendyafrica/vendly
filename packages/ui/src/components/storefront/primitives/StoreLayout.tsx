"use client";

import { Header } from "./Header";
import { CartProvider } from "./CartProvider";
import { CartDrawer } from "./CartDrawer";

interface StoreLayoutProps {
    children: React.ReactNode;
    storeSlug: string;
    storeName: string;
}

export function StoreLayout({ children, storeSlug, storeName }: StoreLayoutProps) {
    return (
        <CartProvider>
            <div className="min-h-screen bg-background text-foreground font-sans">
                <Header storeSlug={storeSlug} storeName={storeName} />
                <main>{children}</main>
                <CartDrawer />
            </div>
        </CartProvider>
    );
}
