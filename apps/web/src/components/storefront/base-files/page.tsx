"use client";

import { Header, HeroSection, CategoryTabs, ProductGrid } from "@/components/storefront";

export default function Home() {
  const storeSlug = process.env.NEXT_PUBLIC_STORE_SLUG || "demo";
  const storeName = process.env.NEXT_PUBLIC_STORE_NAME || "Demo Store";

  return (
    <>
      <Header storeSlug={storeSlug} storeName={storeName} />
      <HeroSection storeSlug={storeSlug} />
      <CategoryTabs storeSlug={storeSlug} />
      <ProductGrid storeSlug={storeSlug} />
    </>
  );
}
