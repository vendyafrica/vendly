"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/app/(m)/components/header";
import Footer from "@/app/(m)/components/footer";
import { MarketplaceGrid } from "@/app/(m)/components/MarketplaceGrid";
import type { MarketplaceStore } from "@/types/marketplace";
import { Button } from "@vendly/ui/components/button";
import Link from "next/link";

export default function CategoryPage() {
    const params = useParams();
    const categorySlug = params.slug as string;
    const [stores, setStores] = useState<MarketplaceStore[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [categoryName, setCategoryName] = useState("");

    useEffect(() => {
        const fetchStores = async () => {
            try {
                const response = await fetch(`/api/marketplace/categories/${categorySlug}/stores`);
                if (response.ok) {
                    const data = await response.json();

                    // Transform API data to match MarketplaceStore interface
                    const transformedStores: MarketplaceStore[] = (data.stores || []).map((store: any) => ({
                        id: store.id,
                        name: store.name,
                        slug: store.slug,
                        description: store.description,
                        categories: store.categories || [],
                        rating: 4.5,
                        logoUrl: null,
                        images: [],
                    }));

                    setStores(transformedStores);

                    // Extract category name from first store or format from slug
                    if (transformedStores.length > 0) {
                        const category = transformedStores[0].categories[0];
                        setCategoryName(category || formatCategoryName(categorySlug));
                    } else {
                        setCategoryName(formatCategoryName(categorySlug));
                    }
                }
            } catch (error) {
                console.error("Error fetching category stores:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStores();
    }, [categorySlug]);

    const formatCategoryName = (slug: string) => {
        return slug
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    return (
        <main className="min-h-screen bg-[#F9F9F7]">
            <Header />

            <div className="container mx-auto px-4 py-12">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">{categoryName}</h1>
                        <p className="text-muted-foreground">
                            {stores.length} {stores.length === 1 ? 'store' : 'stores'} in this category
                        </p>
                    </div>
                    <Link href="/">
                        <Button variant="outline">
                            Back to Home
                        </Button>
                    </Link>
                </div>

                <MarketplaceGrid stores={stores} loading={isLoading} />
            </div>

            <Footer />
        </main>
    );
}
