import Header from "@/app/(m)/components/header";
import Footer from "@/app/(m)/components/footer";
import { MarketplaceGrid } from "@/app/(m)/components/MarketplaceGrid";
import type { MarketplaceStore } from "@/types/marketplace";
import { Button } from "@vendly/ui/components/button";
import Link from "next/link";
import type { Metadata } from "next";
import { marketplaceService } from "@/lib/services/marketplace-service";

interface CategoryPageProps {
    params: {
        category: string;
    }
}

const formatCategoryName = (slug: string) =>
    slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
    const categorySlug = params.category;
    const categoryName = formatCategoryName(categorySlug);

    const title = `${categoryName} | Shop ${categoryName} on Vendly`;
    const description = `Discover ${categoryName} stores and products. Browse curated selections and shop ${categoryName.toLowerCase()} on Vendly.`;

    return {
        title,
        description,
        alternates: {
            canonical: `/category/${categorySlug}`,
        },
        openGraph: {
            title,
            description,
            url: `/category/${categorySlug}`,
        },
        twitter: {
            title,
            description,
        },
    };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const categorySlug = params.category;
    const stores = await marketplaceService.getStoresBySpecificCategory(categorySlug);

    // Transform to UI Model
    const uiStores: MarketplaceStore[] = stores.map(store => ({
        id: store.id,
        name: store.name,
        slug: store.slug,
        description: store.description,
        categories: store.categories || [],
        rating: 4.5,
        logoUrl: store.logoUrl ?? null,
        images: [],
    }));

    const categoryName = formatCategoryName(categorySlug);

    return (
        <main className="min-h-screen bg-background text-foreground">
            <Header />

            <div className="container mx-auto px-4 py-12">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">{categoryName}</h1>
                        <p className="text-muted-foreground">
                            {uiStores.length} {uiStores.length === 1 ? 'store' : 'stores'} in this category
                        </p>
                    </div>
                    <Link href="/">
                        <Button variant="outline">
                            Back to Home
                        </Button>
                    </Link>
                </div>

                <MarketplaceGrid stores={uiStores} loading={false} />
            </div>

            <Footer />
        </main>
    );
}
