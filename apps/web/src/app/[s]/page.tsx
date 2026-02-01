import { ProductGrid } from "./components/product-grid";
import { StorefrontFooter } from "./components/footer";
import { Categories } from "./components/categories";
import { Hero } from "./components/hero";
// Re-saving to trigger rebuild and resolve hydration sync
import { marketplaceService } from "@/lib/services/marketplace-service";
import { notFound } from "next/navigation";

interface StorefrontPageProps {
  params: {
    s: string; // The param is 's' based on folder name [s]
  }
}

export default async function StorefrontHomePage({ params }: StorefrontPageProps) {
  const { s: storeSlug } = await params;
  const store = await marketplaceService.getStoreDetails(storeSlug);
  const products = await marketplaceService.getStoreProducts(storeSlug);

  if (!store) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <Hero store={store} />
      <div className="w-full">
        <Categories />
        <div className="px-8">
          <h3 className="text-lg font-semibold my-8 text-neutral-900">
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