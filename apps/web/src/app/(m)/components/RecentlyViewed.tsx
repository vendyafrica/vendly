"use client";

import { useRecentlyViewed } from "@/hooks/use-recently-viewed";
import { ProductCard } from "../../[s]/components/product-card";

export default function RecentlyViewed() {
    const { recentItems, isLoaded } = useRecentlyViewed();

    if (!isLoaded) return null; // Avoid hydration mismatch or flash
    if (recentItems.length === 0) return null;

    // Helper to format price same as ProductGrid
    const formatPrice = (amount: number, currency: string) => {
        if (currency === "KES") {
            return `KES ${amount.toLocaleString()}`;
        }
        return `$${(amount / 100).toFixed(2)}`;
    };

    return (
        <div className="py-8">
            <h2 className="text-xl font-semibold mb-6">Recently viewed</h2>

            <div className="columns-2 md:columns-4 gap-3 md:gap-4 [column-fill:balance]">
                {recentItems.map((item, index) => (
                    <ProductCard
                        key={item.id}
                        index={index}
                        title={item.name}
                        slug={item.slug}
                        storeSlug={item.store.slug}
                        price={formatPrice(item.price, item.currency)}
                        image={item.image}
                        rating={5} // Default rating or store if available, RecentItem needs rating if we want to show it. For now hardcode or omit if optional
                    />
                ))}
            </div>
        </div>
    );
}
