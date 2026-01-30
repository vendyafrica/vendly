import CategoryCards from "@/app/(m)/components/CategoryCards";
import FeaturedCategory from "@/app/(m)/components/FeaturedCategory";
import Header from "@/app/(m)/components/header";
import Footer from "@/app/(m)/components/footer";
import { MarketplaceGrid } from "@/app/(m)/components/MarketplaceGrid";
import { Button } from "@Vendly/ui/components/button";
import Link from "next/link";
import { marketplaceService } from "@/lib/services/marketplace-service";
import type { MarketplaceStore } from "@/types/marketplace";
import { OneTapLogin } from "@/app/(m)/components/OneTapLogin";

export default async function HomePage() {
    const { categories, stores, storesByCategory } = await marketplaceService.getHomePageData();

    // Transform to UI Model (adding placeholders for missing fields)
    const mapToMarketplaceStore = (s: any): MarketplaceStore => ({
        id: s.id,
        name: s.name,
        slug: s.slug,
        description: s.description,
        categories: s.categories || [],
        rating: 4.5,
        logoUrl: null,
        images: [],
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
                    image: null // Category repo returns objects with image? No, currently repo uses findAll() -> just db fields. Check repo if image exists.
                    // Assuming db schema has image. If not, null.
                })) as any // Casting for now to match UI expectations if strict check fails
            } />

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
                    <div className="space-y-12">
                        {/* All Stores */}
                        <div>
                            <h3 className="text-2xl font-semibold mb-6">All Stores</h3>
                            {/* MarketplaceGrid expects 'stores' prop. We pass uiStores. */}
                            <MarketplaceGrid stores={uiStores} loading={false} />
                        </div>

                        {/* Stores by Category */}
                        {Object.entries(uiStoresByCategory).map(([categoryName, categoryStores]) => (
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
