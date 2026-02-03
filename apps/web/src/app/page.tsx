import CategoryCards from "@/app/(m)/components/CategoryCards";
import Header from "@/app/(m)/components/header";
import Footer from "@/app/(m)/components/footer";
import { MarketplaceGrid } from "@/app/(m)/components/MarketplaceGrid";
import { Button } from "@vendly/ui/components/button";
import Link from "next/link";
import { marketplaceService } from "@/lib/services/marketplace-service";
import type { MarketplaceStore } from "@/types/marketplace";
import type { StoreWithCategory } from "@/lib/services/marketplace-service";
import { OneTapLogin } from "@/app/(m)/components/OneTapLogin";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRightIcon } from "@hugeicons/core-free-icons";

export default async function HomePage() {
    const { categories, stores, storesByCategory } = await marketplaceService.getHomePageData();

    const mapToMarketplaceStore = (s: StoreWithCategory): MarketplaceStore => ({
        id: s.id,
        name: s.name,
        slug: s.slug,
        description: s.description,
        categories: s.categories || [],
        rating: 4.5,
        logoUrl: s.logoUrl ?? null,
        heroMedia: s.heroMedia ?? null,
        heroMediaType: s.heroMediaType ?? null,
        heroMediaItems: Array.isArray(s.heroMediaItems) ? s.heroMediaItems : [],
        images: Array.isArray(s.images) ? s.images : [],
    });

    const uiStores = stores.map(mapToMarketplaceStore);
    const uiStoresByCategory: Record<string, MarketplaceStore[]> = {};

    Object.entries(storesByCategory).forEach(([cat, list]) => {
        uiStoresByCategory[cat] = list.map(mapToMarketplaceStore);
    });

    return (
        <main className="min-h-screen bg-[#F9F9F7]">
            <Header />
            <OneTapLogin />

            <CategoryCards categories={
                categories.map(c => ({
                    id: c.id,
                    name: c.name,
                    image: null
                })) as any
            } />

            <div className="container mx-auto px-4 py-9">
                <div className="flex items-start mb-8">
                    <div>
                        <h2 className="text-xl font-semibold mb-1">Discover your next favorite stores all in one place</h2>
                    </div>
                </div>

                {uiStores.length === 0 ? (
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
                    <div className="space-y-9">
                        <div>
                            <h3 className="text-2xl font-semibold mb-3">Featured</h3>
                            <MarketplaceGrid stores={uiStores} loading={false} />
                        </div>

                        {Object.entries(uiStoresByCategory).map(([categoryName, categoryStores]) => (
                            <div key={categoryName}>
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-2xl font-semibold">{categoryName}</h3>
                                    <span>
                                        <Link
                                            href={`/category/${categoryName.toLowerCase().replace(/\s+/g, '-')}`}
                                            className="text-primary hover:underline"
                                        >
                                            <HugeiconsIcon icon={ArrowRightIcon} />
                                        </Link>
                                    </span>
                                </div>
                                <MarketplaceGrid stores={categoryStores.slice(0, 5)} loading={false} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </main>
    );
}
