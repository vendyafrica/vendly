"use client";

import { ProductCard } from "./ProductCard";

interface Product {
  id: string;
  title: string;
  description?: string | null;
  priceAmount: number;
  currency: string;
  status: string;
  imageUrl?: string;
}

interface ProductGridProps {
  storeSlug: string;
  products: Product[];
  title?: string;
  showViewAll?: boolean;
}

export function ProductGrid({ storeSlug, products, showViewAll = true }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <div className="text-5xl mb-4">🛍️</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No products yet</h3>
          <p className="text-gray-500">Check back soon for new arrivals!</p>
        </div>
      </div>
    );
  }

  // Show only first 8 products for the grid
  const displayedProducts = products.slice(0, 8);

  return (
    <div className="pb-16" style={{ backgroundColor: "var(--background, #ffffff)" }}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="pt-12 pb-8">
          <h2
            className="text-xl md:text-2xl font-semibold tracking-tight"
            style={{
              color: "var(--foreground, #111111)",
              fontFamily: "var(--font-heading, inherit)",
            }}
          >
            Featured Collections
          </h2>
        </div>
        {/* Product Grid - 4 columns on desktop, 2 on mobile */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {displayedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                id: product.id,
                name: product.title,
                title: product.title,
                price: product.priceAmount,
                priceAmount: product.priceAmount,
                description: product.description ?? undefined,
                imageUrl: product.imageUrl,
                status: product.status,
              }}
              storeSlug={storeSlug}
              showAddToCart={true}
            />
          ))}
        </div>

        {/* View All Button */}
        {showViewAll && products.length > 8 && (
          <div className="text-center mt-12">
            <a
              href={`/${storeSlug}/products`}
              className="inline-flex items-center gap-2 border-2 border-gray-900 text-gray-900 px-8 py-3 font-medium hover:bg-gray-900 hover:text-white transition-colors text-sm tracking-wide uppercase"
            >
              View All Products
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
