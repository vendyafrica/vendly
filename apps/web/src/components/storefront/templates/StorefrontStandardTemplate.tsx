import { Header } from "@/components/storefront/Header";
import { HeroSection } from "@/components/storefront/HeroSection";
import { ProductGrid } from "@/components/storefront/ProductGrid";
import { Footer } from "@/components/storefront/Footer";
import { FeaturedSections } from "@/components/storefront/FeaturedSections";

type StoreTheme = Partial<{
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  headingFont: string;
  bodyFont: string;
}> &
  Record<string, unknown>;

type StoreContent = Partial<{
  heroLabel: string;
  heroTitle: string | null;
  heroSubtitle: string | null;
  heroCta: string;
  heroImageUrl: string | null;
  newsletterTitle: string;
  newsletterSubtitle?: string | null;
}> &
  Record<string, unknown>;

type Store = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  logoUrl?: string | null;
};

type Product = {
  id: string;
  title: string;
  description?: string | null;
  priceAmount: number;
  currency: string;
  status: string;
  imageUrl?: string;
};

export function StorefrontStandardTemplate({
  storeSlug,
  store,
  theme,
  content,
  products,
}: {
  storeSlug: string;
  store: Store;
  theme?: StoreTheme;
  content?: StoreContent;
  products: Product[];
}) {
  return (
    <div className="min-h-screen bg-white">
      <Header storeSlug={storeSlug} storeName={store.name} theme={theme} />
      <HeroSection store={store} storeSlug={storeSlug} theme={theme} content={content} />
      <FeaturedSections storeSlug={storeSlug} storeName={store.name} />
      <ProductGrid storeSlug={storeSlug} products={products} />
      <Footer
        storeSlug={storeSlug}
        storeName={store.name}
        storeDescription={store.description ?? undefined}
        theme={theme}
        content={content}
      />
    </div>
  );
}
