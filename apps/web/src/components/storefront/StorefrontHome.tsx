"use client";

import { StorefrontStandardTemplate } from "@/components/storefront/templates/StorefrontStandardTemplate";
import { useStorefrontStore } from "@/hooks/useStorefrontStore";
import { useStorefrontProducts } from "@/hooks/useStorefrontProducts";

export function StorefrontHome({ storeSlug }: { storeSlug: string }) {
  const { store, isLoading: isStoreLoading, error: storeError } = useStorefrontStore(storeSlug);
  const { products, isLoading: isProductsLoading, error: productsError } = useStorefrontProducts(storeSlug, {
    limit: 12,
  });

  if (isStoreLoading || isProductsLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-gray-200 rounded w-1/3" />
            <div className="h-64 bg-gray-200 rounded" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (storeError || productsError || !store) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <h1 className="text-xl font-semibold">Failed to load storefront</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {(storeError || productsError)?.message || "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <StorefrontStandardTemplate
      storeSlug={storeSlug}
      store={{
        id: store.id,
        name: store.name,
        slug: store.slug,
        description: store.description ?? null,
        logoUrl: store.logoUrl ?? null,
      }}
      theme={store.theme}
      content={store.content}
      products={products}
    />
  );
}
