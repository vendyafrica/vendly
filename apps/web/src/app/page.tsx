"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CategoryCards from "@/app/(m)/components/CategoryCards";
import FeaturedCategory from "@/app/(m)/components/FeaturedCategory";
import Header from "@/app/(m)/components/header";
import Footer from "@/app/(m)/components/footer";
import { MarketplaceGrid } from "@/app/(m)/components/MarketplaceGrid";
import { Button } from "@Vendly/ui/components/button";
import { signInWithOneTap } from "@vendly/auth/react";
import { getCategoriesAction } from "@/actions/categories";
import type { MarketplaceStore } from "@/types/marketplace";

export default function HomePage() {
    const [categories, setCategories] = useState<{ id: string; name: string; image: string | null }[]>([]);
    const [stores, setStores] = useState<MarketplaceStore[]>([]);
    const [storesByCategory, setStoresByCategory] = useState<Record<string, MarketplaceStore[]>>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            signInWithOneTap().catch(console.error);
        }, 3000);

        const fetchData = async () => {
            try {
                const categoriesRes = await getCategoriesAction();
                if (categoriesRes.success && categoriesRes.data) {
                    setCategories(categoriesRes.data);
                }
                const storesRes = await fetch("/api/marketplace/stores");
                if (storesRes.ok) {
                    const data = await storesRes.json();

                    // Transform API data to match MarketplaceStore interface
                    const transformedStores: MarketplaceStore[] = (data.stores || []).map((store: any) => ({
                        id: store.id,
                        name: store.name,
                        slug: store.slug,
                        description: store.description,
                        categories: store.categories || [],
                        rating: 4.5, // Default rating since we don't have it in DB yet
                        logoUrl: null,
                        images: [],
                    }));

                    setStores(transformedStores);

                    // Transform storesByCategory as well
                    const transformedByCategory: Record<string, MarketplaceStore[]> = {};
                    (Object.entries(data.storesByCategory || {}) as [string, any[]][]).forEach(([category, categoryStores]) => {
                        transformedByCategory[category] = categoryStores.map((store: any) => ({
                            id: store.id,
                            name: store.name,
                            slug: store.slug,
                            description: store.description,
                            categories: store.categories || [],
                            rating: 4.5,
                            logoUrl: null,
                            images: [],
                        }));
                    });
                    setStoresByCategory(transformedByCategory);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();

        return () => clearTimeout(timer);
    }, []);

    return (
        <main className="min-h-screen bg-[#F9F9F7]">
            <Header />
            <CategoryCards categories={categories} />
            <FeaturedCategory />

            {/* Marketplace Stores Section */}
            <div className="container mx-auto px-4 py-12">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">Discover Stores</h2>
                        <p className="text-muted-foreground">
                            Browse through our curated collection of stores
                        </p>
                    </div>
                    <Link href="/c">
                        <Button size="lg">
                            Start Selling
                        </Button>
                    </Link>
                </div>

                {stores.length === 0 && !isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <h3 className="text-2xl font-semibold mb-4">No stores yet</h3>
                        <p className="text-gray-600 mb-8">Be the first to create a store on Vendly!</p>
                        <Link href="/c">
                            <Button size="lg">
                                Create Your Store
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {/* All Stores */}
                        {stores.length > 0 && (
                            <div>
                                <h3 className="text-2xl font-semibold mb-6">All Stores</h3>
                                <MarketplaceGrid stores={stores} loading={isLoading} />
                            </div>
                        )}

                        {/* Stores by Category */}
                        {Object.entries(storesByCategory).map(([categoryName, categoryStores]) => (
                            <div key={categoryName}>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-semibold">{categoryName}</h3>
                                    <Link
                                        href={`/category/${categoryName.toLowerCase().replace(/\s+/g, '-')}`}
                                        className="text-primary hover:underline"
                                    >
                                        View all →
                                    </Link>
                                </div>
                                <MarketplaceGrid stores={categoryStores.slice(0, 5)} loading={isLoading} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
