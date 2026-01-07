import { getStoreBySlug, getProductsByStoreSlug, getProductImages } from '@vendly/db';
import { notFound } from 'next/navigation';
import { Header, ProductGrid, Footer, CartProvider, CartDrawer } from '@/components/storefront';

type Props = {
    params: Promise<{ subdomain: string }>;
};

export default async function ProductsPage({ params }: Props) {
    const { subdomain } = await params;
    const store = await getStoreBySlug(subdomain);

    if (!store) {
        notFound();
    }

    const products = await getProductsByStoreSlug(subdomain);
    const productsWithImages = await Promise.all(
        products.map(async (product) => {
            const images = await getProductImages(product.id);
            return {
                ...product,
                imageUrl: images[0]?.url,
                priceAmount: product.basePriceAmount,
                currency: product.baseCurrency,
            };
        })
    );

    return (
        <CartProvider>
            <div className="min-h-screen flex flex-col">
                <Header storeSlug={subdomain} storeName={store.name} />
                <main className="flex-1 py-12">
                    <div className="container mx-auto px-4 lg:px-8">
                        <h1 className="text-3xl font-bold mb-8">All Products</h1>
                        <ProductGrid storeSlug={subdomain} products={productsWithImages} showViewAll={false} />
                    </div>
                </main>
                <Footer storeSlug={subdomain} storeName={store.name} />
                <CartDrawer />
            </div>
        </CartProvider>
    );
}
