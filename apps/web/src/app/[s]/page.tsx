import { ProductGrid } from "./components/product-grid";
import { StorefrontFooter } from "./components/footer";
import { Categories } from "./components/categories";
import { Hero } from "./components/hero";
import { StorefrontViewTracker } from "./components/StorefrontViewTracker";
// Re-saving to trigger rebuild and resolve hydration sync
import { marketplaceService } from "@/lib/services/marketplace-service";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface StorefrontPageProps {
  params: Promise<{
    s: string; // The param is 's' based on folder name [s]
  }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: StorefrontPageProps): Promise<Metadata> {
  const { s } = await params;
  const store = await marketplaceService.getStoreDetails(s);
  if (!store) {
    return {
      title: "Store not found | Vendly",
      description: "Browse independent sellers on Vendly.",
      robots: { index: false, follow: false },
    };
  }

  const title = `${store.name} | Shop on Vendly`;
  const description = store.description || `Shop ${store.name} with trusted payments and delivery on Vendly.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/${store.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/${store.slug}`,
    },
    twitter: {
      title,
      description,
    },
  };
}

export default async function StorefrontHomePage({ params, searchParams }: StorefrontPageProps) {
  const { s: storeSlug } = await params;
  const resolvedSearchParams = await searchParams;
  const search = resolvedSearchParams?.q;
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