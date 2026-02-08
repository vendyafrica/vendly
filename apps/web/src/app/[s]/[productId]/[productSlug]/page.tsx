import { ProductDetails } from "../../components/product-details";
import { ProductGridReveal } from "../../components/product-grid-reveal";
import { StorefrontFooter } from "../../components/footer";
import { marketplaceService } from "@/lib/services/marketplace-service";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

interface PageProps {
  params: Promise<{
    s: string;
    productId: string;
    productSlug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { s: storeSlug, productId } = await params;

  if (!isUuid(productId)) {
    return {
      title: "Product not found | Vendly",
      description: "Browse independent sellers on Vendly.",
      robots: { index: false, follow: false },
    };
  }

  const store = await marketplaceService.getStoreDetails(storeSlug);
  const product = await marketplaceService.getStoreProductById(storeSlug, productId);

  if (!store || !product) {
    return {
      title: "Product not found | Vendly",
      description: "Browse independent sellers on Vendly.",
      robots: { index: false, follow: false },
    };
  }

  const canonical = `/${store.slug}/${product.id}/${product.slug}`;

  const title = `${product.name} by ${store.name} | Vendly`;
  const description = product.description || `Shop ${product.name} from ${store.name} with trusted payments and delivery on Vendly.`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
    },
    twitter: {
      title,
      description,
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { s: storeSlug, productId, productSlug } = await params;

  if (!isUuid(productId)) {
    notFound();
  }

  const store = await marketplaceService.getStoreDetails(storeSlug);
  const product = await marketplaceService.getStoreProductById(storeSlug, productId);
  const products = (await marketplaceService.getStoreProducts(storeSlug)).map((p) => ({
    ...p,
    rating: 0,
  }));

  if (!store || !product) {
    notFound();
  }

  const canonicalPath = `/${store.slug}/${product.id}/${product.slug}`;
  const currentPath = `/${storeSlug}/${productId}/${productSlug}`;

  if (currentPath !== canonicalPath) {
    redirect(canonicalPath);
  }

  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 md:pt-32 md:pb-20">
        <ProductDetails product={product} />
      </div>
      <ProductGridReveal products={products} />
      <StorefrontFooter store={store} />
    </main>
  );
}
