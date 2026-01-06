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
}

export function ProductGrid({ storeSlug, products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center py-12 bg-muted/30 rounded-2xl border border-border">
          <div className="text-4xl mb-4">🛍️</div>
          <h3 className="text-lg font-medium text-foreground mb-2">No products yet</h3>
          <p className="text-muted-foreground">Check back soon for new arrivals!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Our Products</h2>
        <p className="text-sm text-muted-foreground">{products.length} items</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
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
          />
        ))}
      </div>
    </div>
  );
}
