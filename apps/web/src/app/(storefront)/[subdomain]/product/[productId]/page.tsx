import { StorefrontProduct } from "@/components/storefront/StorefrontProduct";

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
        <StorefrontProduct storeSlug={subdomain} productId={productId} />
    );
}
