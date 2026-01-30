import { ProductCard } from './product-card';

interface Product {
    id: string;
    slug: string;
    name: string;
    price: number;
    currency: string;
    image: string | null;
    rating: number;
}

interface ProductGridProps {
    products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
    if (products.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-neutral-500">No products available yet.</p>
            </div>
        );
    }

    // Format price for display
    const formatPrice = (amount: number, currency: string) => {
        if (currency === "KES") {
            return `KES ${amount.toLocaleString()}`;
        }
        return `$${(amount / 100).toFixed(2)}`;
    };

    return (
        <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-3 sm:gap-4 lg:gap-5 px-3 sm:px-4 lg:px-6 xl:px-8 [column-fill:balance]">
            {products.map((product, index) => (
                <ProductCard
                    key={product.id}
                    index={index}
                    title={product.name}
                    slug={product.slug}
                    price={formatPrice(product.price, product.currency)}
                    image={product.image}
                    rating={product.rating}
                />
            ))}
        </div>
    );
}   