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

function getString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

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
  const coverImageUrl = getString((content as unknown as Record<string, unknown> | undefined)?.heroImageUrl) ?? null;
  const featuredImages = products
    .map((p) => p.imageUrl)
    .filter((u): u is string => typeof u === "string" && u.length > 0)
    .slice(0, 6);

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "var(--background, #ffffff)",
        color: "var(--foreground, #111111)",
        fontFamily: "var(--font-body, inherit)",
      }}
    >
      <section className="relative overflow-hidden">
        {coverImageUrl && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${coverImageUrl})` }}
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.55) 35%, rgba(0,0,0,0.25) 100%)",
          }}
        />

        <div className="relative">
          <Header storeSlug={storeSlug} storeName={store.name} theme={theme} overlay />
          <HeroSection store={store} storeSlug={storeSlug} theme={theme} content={content} />
        </div>
      </section>

      <ProductGrid storeSlug={storeSlug} products={products} />
      <FeaturedSections storeSlug={storeSlug} storeName={store.name} images={featuredImages} />
      <Footer
        storeSlug={storeSlug}
        storeName={store.name}
        theme={theme}
      />
    </div>
  );
}
