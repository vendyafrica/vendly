import { ProductDetails } from "../../components/product-details";
import { ProductGridReveal } from "../../components/product-grid-reveal";
import { StorefrontFooter } from "../../components/footer";
import { marketplaceService } from "@/lib/services/marketplace-service";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";

const siteUrl = process.env.WEB_URL || "https://shopvendly.store";

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
  const { s, productId } = await params;

  if (!isUuid(productId)) {
    return {
      title: "Product not found | ShopVendly",
      description: "Browse independent sellers on ShopVendly.",
      robots: { index: false, follow: false },
    };
  }

  const store = await marketplaceService.getStoreDetails(s);
  const product = await marketplaceService.getStoreProductById(s, productId);

  if (!store || !product) {
    return {
      title: "Product not found | ShopVendly",
      description: "Browse independent sellers on ShopVendly.",
      robots: { index: false, follow: false },
    };
  }

  const canonical = `/${store.slug}/${product.id}/${product.slug}`;
  const ogImage = product.images?.[0] || store.logoUrl || "/og-image.png";

  const title = `${product.name} by ${store.name} | ShopVendly`;
  const description = product.description || `Shop ${product.name} from ${store.name} with trusted payments and delivery on ShopVendly.`;

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

export default async function ProductPage({ params }: PageProps) {
  const { s, productId, productSlug } = await params;

  if (!isUuid(productId)) {
    notFound();
  }

  const store = await marketplaceService.getStoreDetails(s);
  const product = await marketplaceService.getStoreProductById(s, productId);
  const products = (await marketplaceService.getStoreProducts(s)).map((p) => ({
    ...p,
    rating: 0,
  }));

  if (!store || !product) {
    notFound();
  }

  const canonicalPath = `/${store.slug}/${product.id}/${product.slug}`;
  const currentPath = `/${s}/${productId}/${productSlug}`;
  const storeCategories = (store as { categories?: string[] }).categories ?? [];

  if (currentPath !== canonicalPath) {
    redirect(canonicalPath);
  }

  const productImage = product.images?.[0] || store.logoUrl || "";
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || undefined,
    image: product.images?.length ? product.images : productImage ? [productImage] : undefined,
    brand: {
      "@type": "Brand",
      name: store.name,
    },
    offers: {
      "@type": "Offer",
      url: `${siteUrl}${canonicalPath}`,
      priceCurrency: product.currency,
      price: product.price,
      availability: "https://schema.org/InStock",
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Marketplace",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: store.name,
        item: `${siteUrl}/${store.slug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `${siteUrl}${canonicalPath}`,
      },
    ],
  };

  return (
    <main className="bg-white min-h-screen">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 md:pt-32 md:pb-20">
        <ProductDetails product={product} storeCategories={storeCategories} />
      </div>
      <ProductGridReveal products={products} />
      <StorefrontFooter store={store} />
    </main>
  );
}
