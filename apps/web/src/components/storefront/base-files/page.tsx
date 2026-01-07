"use client";

import { Header, HeroSection, CategoryTabs, ProductGrid } from "@/components/storefront";

export default function Home() {
  const storeSlug = process.env.NEXT_PUBLIC_STORE_SLUG || "demo";
  const storeName = process.env.NEXT_PUBLIC_STORE_NAME || "Demo Store";

  // Demo store data
  const demoStore = {
    id: "demo",
    name: storeName,
    slug: storeSlug,
    description: "Welcome to our demo store",
    logoUrl: null,
  };

  return (
    <>
      <Header storeSlug={storeSlug} storeName={storeName} />
      <HeroSection store={demoStore} storeSlug={storeSlug} />
      <CategoryTabs storeSlug={storeSlug} categories={[]} />
      <ProductGrid storeSlug={storeSlug} products={[]} />
    </>
  );
}
