import { ProductDetails } from "../../components/product-details";
import { ProductGridReveal } from "../../components/product-grid-reveal";
import { StorefrontFooter } from "../../components/footer";
import { marketplaceService } from "@/lib/services/marketplace-service";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface PageProps {
    params: {
        s: string;
        slug: string;
    };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { s: storeSlug, slug } = params;
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

    return {
        title,
        description,
        alternates: {
            canonical: `/${store.slug}/products/${product.slug}`,
        },
        openGraph: {
            title,
            description,
            url: `/${store.slug}/products/${product.slug}`,
        },
        twitter: {
            title,
            description,
        },
    };
}

export default async function ProductPage({ params }: PageProps) {
    const { s: storeSlug, slug } = params;

    const store = await marketplaceService.getStoreDetails(storeSlug);
    const product = await marketplaceService.getStoreProduct(storeSlug, slug);
    const products = await marketplaceService.getStoreProducts(storeSlug);

    if (!store || !product) {
        notFound();
    }

    return (
        <main className="bg-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 md:pt-32 md:pb-20">
                <ProductDetails product={product} />
            </div>
            <ProductGridReveal products={products} />
            <StorefrontFooter store={store} />
        </main>
    );
}
