import { ProductDetails } from "../../components/product-details";
import { ProductGridReveal } from "../../components/product-grid-reveal";
import { StorefrontFooter } from "../../components/footer";
import { StorefrontHeader } from "../../components/header";

interface PageProps {
    params: Promise<{
        storefront: string;
        slug: string;
    }>;
}

export default async function ProductPage({ params }: PageProps) {
    const { slug } = await params;

    return (
        <main className="bg-white min-h-screen">
            <StorefrontHeader />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 md:pt-32 md:pb-20">
                <ProductDetails slug={slug} />
            </div>
            <ProductGridReveal />
            <StorefrontFooter />
        </main>
    );
}
