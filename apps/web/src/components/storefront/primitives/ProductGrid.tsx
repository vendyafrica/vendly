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

export function ProductGrid({ storeSlug, products, title, showViewAll = true }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="mx-auto px-4 lg:px-8 py-16 max-w-[var(--container-max,1400px)]">
        <div className="text-center py-24 bg-[var(--muted,#f5f5f5)] rounded-[var(--radius,0.5rem)]">
          <div className="text-5xl mb-4 opacity-50">🛍️</div>
          <h3 className="text-xl font-medium text-[var(--foreground)] mb-2">No products yet</h3>
          <p className="text-[var(--muted-foreground)]">Check back soon for new arrivals!</p>
        </div>
      </div>
    );
  }

  // Show only first 8 products for the grid
  const displayedProducts = products.slice(0, 8);

  return (
    <section className="py-20" style={{ backgroundColor: "var(--background, #ffffff)" }}>
      <div className="mx-auto px-4 lg:px-8 max-w-[var(--container-max,1400px)]">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-4">
          <div>
            <h2
              className="text-3xl md:text-4xl font-bold tracking-tight mb-2"
              style={{
                color: "var(--foreground, #111111)",
                fontFamily: "var(--font-heading, inherit)",
              }}
            >
              {title || "Featured Collections"}
            </h2>
            <div className="h-1 w-20 bg-[var(--primary)] mt-4"></div>
          </div>

          {showViewAll && products.length > 8 && (
            <a
              href={`/${storeSlug}/products`}
              className="text-sm font-semibold border-b border-[var(--foreground)] pb-0.5 hover:opacity-70 transition-opacity"
              style={{ color: "var(--foreground)" }}
            >
              View All Products
            </a>
          )}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-y-12">
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

        {/* Mobile View All Button (if not shown in header or just redundant) */}
        {showViewAll && products.length > 8 && (
          <div className="md:hidden text-center mt-12">
            <a
              href={`/${storeSlug}/products`}
              className="inline-block px-6 py-3 bg-[var(--primary)] text-[var(--primary-foreground)] font-medium rounded-[var(--radius)]"
            >
              View All Products
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
