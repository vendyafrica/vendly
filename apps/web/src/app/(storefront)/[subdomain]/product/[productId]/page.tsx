import { ProductDetailsTemplate } from "@/components/storefront/product-detail";
import { getStorefrontData } from "@/lib/storefront-data";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = {
    params: Promise<{
        subdomain: string;
        productId: string;
    }>;
};

/**
 * Product Details Page
 *
 * TODO: When backend is ready, replace with actual API call:
 * - GET /api/public/stores/:slug/products/:productId
 */
export default async function ProductPage({ params }: Props) {
    const { subdomain, productId } = await params;

    try {
        // TODO: Fetch product details from API
        // const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        // const response = await fetch(`${API_URL}/api/public/stores/${subdomain}/products/${productId}`);

        const storefrontData = await getStorefrontData(subdomain);
        const product = storefrontData.products.find((p) => p.id === productId);

        if (!product) {
            notFound();
        }

        // Get similar products (same category/random selection)
        const similarProducts = storefrontData.products.filter((p) => p.id !== productId).slice(0, 4);

        return <ProductDetailsTemplate storeName={storefrontData.store.name} product={product} similarProducts={similarProducts} />;
    } catch (error) {
        console.error("Error loading product:", error);
        notFound();
    }
}
