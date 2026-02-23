import { ProductGrid } from "./components/product-grid";
import { StorefrontFooter } from "./components/footer";
import { Hero } from "./components/hero";
import { StorefrontViewTracker } from "./components/StorefrontViewTracker";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { headers } from "next/headers";

type StorefrontStore = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl?: string | null;
  heroMedia?: string[];
  categories?: string[];
};

type StorefrontProduct = {
  id: string;
  slug: string;
  name: string;
  price: number;
  currency: string;
  image: string | null;
  contentType?: string | null;
};

const getApiBaseUrl = async () => {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") || headerList.get("host");
  const proto = headerList.get("x-forwarded-proto") || "https";
  return host ? `${proto}://${host}` : process.env.WEB_URL || "https://shopvendly.store";
};

interface StorefrontPageProps {
  params: Promise<{
    s: string;
  }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: StorefrontPageProps): Promise<Metadata> {
  const { s } = await params;
  const baseUrl = await getApiBaseUrl();
  const storeRes = await fetch(`${baseUrl}/api/storefront/${s}`, { next: { revalidate: 60 } });
  const store = storeRes.ok ? (await storeRes.json()) as StorefrontStore : null;
  if (!store) {
    return {
      title: "Store not found | ShopVendly",
      description: "Browse independent sellers on ShopVendly.",
      robots: { index: false, follow: false },
    };
  }

  const title = `${store.name} | Shop on ShopVendly`;
  const description = store.description || `Shop ${store.name} with trusted payments and delivery on ShopVendly.`;
  const ogImage = store.heroMedia?.[0] || store.logoUrl || "/og-image.png";

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
      siteName: "ShopVendly",
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

export default async function StorefrontHomePage({ params, searchParams }: StorefrontPageProps) {
  const { s } = await params;

  const resolvedSearchParams = await searchParams;
  const search = resolvedSearchParams?.q;
  const query = Array.isArray(search) ? search[0] : search;

  const baseUrl = await getApiBaseUrl();
  const storeRes = await fetch(`${baseUrl}/api/storefront/${s}`, { next: { revalidate: 60 } });
  const store = storeRes.ok ? (await storeRes.json()) as StorefrontStore : null;

  if (!store) {
    notFound();
  }

  const productUrl = new URL(`${baseUrl}/api/storefront/${s}/products`);
  if (query) productUrl.searchParams.set("q", query);
  const productsRes = await fetch(productUrl.toString(), { next: { revalidate: 30 } });
  const products = productsRes.ok ? (await productsRes.json()) as StorefrontProduct[] : [];

  return (
    <div className="min-h-screen">
      <StorefrontViewTracker storeSlug={s} />
      <Hero store={store} />
      <div className="w-full">
        <div className="px-3 sm:px-6 lg:px-8">
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