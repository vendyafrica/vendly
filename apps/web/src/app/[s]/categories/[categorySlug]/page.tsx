import { marketplaceService } from "@/lib/services/marketplace-service";
import { notFound } from "next/navigation";
import { ProductGrid } from "../../components/product-grid";
import { Categories } from "../../components/categories";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ s: string; categorySlug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { s: storeSlug, categorySlug } = await params;

  const store = await marketplaceService.getStoreDetails(storeSlug);

  if (!store) {
    return {
      title: "Store not found | Vendly",
      description: "Browse independent sellers on Vendly.",
      robots: { index: false, follow: false },
    };
  }

  const title = `${categorySlug} | ${store.name} | Vendly`;
  const description = `Shop ${categorySlug} from ${store.name} on Vendly. Discover top picks, trusted sellers, and fast delivery.`;
  const ogImage = store.heroMedia?.[0] || store.logoUrl || "/og-image.png";

  return {
    title,
    description,
    alternates: {
      canonical: `/${store.slug}/categories/${categorySlug}`,
    },
    openGraph: {
      title,
      description,
      url: `/${store.slug}/categories/${categorySlug}`,
      siteName: "Vendly",
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function StorefrontCategoryPage({ params, searchParams }: PageProps) {
  const { s: storeSlug, categorySlug } = await params;
  const resolvedSearchParams = await searchParams;
  const search = resolvedSearchParams?.q;
  const query = Array.isArray(search) ? search[0] : search;

  const store = await marketplaceService.getStoreDetails(storeSlug);
  if (!store) notFound();

  const products = await marketplaceService.getStoreProductsByCategorySlug(storeSlug, categorySlug, query);

  return (
    <div className="min-h-screen">
      <div className="w-full">
        <Categories />
        <div className="px-8">
          <h3 className="text-lg font-semibold my-8 text-foreground">
            {categorySlug}
          </h3>
          <ProductGrid products={products} />
        </div>
        <div className="my-20" />
      </div>
    </div>
  );
}
