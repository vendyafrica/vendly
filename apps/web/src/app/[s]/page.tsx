import { ProductGrid } from "./components/product-grid";
import { StorefrontFooter } from "./components/footer";
import { Categories } from "./components/categories";
import { Hero } from "./components/hero";
import { StorefrontViewTracker } from "./components/StorefrontViewTracker";
// Re-saving to trigger rebuild and resolve hydration sync
import { marketplaceService } from "@/lib/services/marketplace-service";
import { notFound } from "next/navigation";

interface StorefrontPageProps {
  params: {
    s: string; // The param is 's' based on folder name [s]
  };
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function StorefrontHomePage({ params, searchParams }: StorefrontPageProps) {
  const { s: storeSlug } = await params;
  const search = (await searchParams)?.q;
  const query = Array.isArray(search) ? search[0] : search;

  const store = await marketplaceService.getStoreDetails(storeSlug);
  const products = await marketplaceService.getStoreProducts(storeSlug, query);

  if (!store) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <StorefrontViewTracker storeSlug={storeSlug} />
      <Hero store={store} />
      <div className="w-full">
        <Categories />
        <div className="px-8">
          <h3 className="text-lg font-semibold my-8 text-foreground">
            All Products
          </h3>
          <ProductGrid products={products} />
        </div>
        <div className="my-20" />
      </div>
      <StorefrontFooter store={store} />
    </div>
  );
}