import { ProductDetail } from "@/components/storefront/product/ProductDetail";
import { CartProvider, CartDrawer } from "@/components/storefront";

export const dynamic = 'force-dynamic';

type Props = {
    params: Promise<{
        subdomain: string;
        productId: string;
    }>;
};

export default async function ProductPage({ params }: Props) {
    const { subdomain, productId } = await params;

    return (
        <CartProvider>
            <ProductDetail storeSlug={subdomain} productId={productId} />
            <CartDrawer />
        </CartProvider>
    );
}
