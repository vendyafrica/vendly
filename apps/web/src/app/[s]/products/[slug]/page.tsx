import { marketplaceService } from "@/lib/services/marketplace-service";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";

interface PageProps {
    params: Promise<{
        s: string;
        slug: string;
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { s: storeSlug, slug } = await params;
    const store = await marketplaceService.getStoreDetails(storeSlug);
    const product = await marketplaceService.getStoreProduct(storeSlug, slug);

    if (!store || !product) {
        return {
            title: "Product not found | Vendly",
            description: "Browse independent sellers on Vendly.",
            robots: { index: false, follow: false },
        };
    }

    const title = `${product.name} by ${store.name} | Vendly`;
    const description = product.description || `Shop ${product.name} from ${store.name} with trusted payments and delivery on Vendly.`;

    // Legacy route; point canonical to new structure
    const canonical = `/${store.slug}/${product.id}/${product.slug}`;

    return {
        title,
        description,
        alternates: {
            canonical,
        },
        openGraph: {
            title,
            description,
            url: canonical,
        },
        twitter: {
            title,
            description,
        },
    };
}

export default async function ProductPage({ params }: PageProps) {
    const { s: storeSlug, slug } = await params;

    const store = await marketplaceService.getStoreDetails(storeSlug);
    const product = await marketplaceService.getStoreProduct(storeSlug, slug);

    if (!store || !product) {
        notFound();
    }

    // Redirect legacy route to new canonical structure
    redirect(`/${store.slug}/${product.id}/${product.slug}`);

    return null;
}
