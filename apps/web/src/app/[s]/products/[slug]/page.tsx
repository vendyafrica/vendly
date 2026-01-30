import { ProductDetails } from "../../components/product-details";
import { ProductGridReveal } from "../../components/product-grid-reveal";
import { StorefrontFooter } from "../../components/footer";
import { StorefrontHeader } from "../../components/header";
import { marketplaceService } from "@/lib/services/marketplace-service";
import { notFound } from "next/navigation";

interface PageProps {
    params: {
        s: string;
        slug: string;
    };
}

export default async function ProductPage({ params }: PageProps) {
    const { s: storeSlug, slug } = params;
    const product = await marketplaceService.getStoreProduct(storeSlug, slug);

    if (!product) {
        notFound();
    }

    return (
        <main className="bg-white min-h-screen">
            <StorefrontHeader />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 md:pt-32 md:pb-20">
                <ProductDetails product={product} />
            </div>
            <ProductGridReveal />
            <StorefrontFooter />
        </main>
    );
}
