import Header from "@/app/(m)/components/header";
import Footer from "@/app/(m)/components/footer";
import { Button } from "@vendly/ui/components/button";
import Link from "next/link";
import { marketplaceService } from "@/lib/services/marketplace-service";
import type { MarketplaceStore } from "@/types/marketplace";
import type { StoreWithCategory } from "@/lib/services/marketplace-service";
import { OneTapLogin } from "@/app/(m)/components/OneTapLogin";
import { HeroSection } from "@/app/(m)/components/home/HeroSection";
import { CollectionsRail } from "@/app/(m)/components/home/CollectionsRail";
import { CategoryShelf } from "@/app/(m)/components/home/CategoryShelf";
import type { Metadata } from "next";
import { Suspense } from "react";
import { headers } from "next/headers";
import { auth } from "@vendly/auth";
import { PostHogProvider, Providers } from "./providers";
import { AppSessionProvider } from "@/contexts/app-session-context";
import { CartProvider } from "@/contexts/cart-context";
import type { ReactNode } from "react";

const homeTitle = "Vendly | Shop African Creators & Social Sellers";
const homeDescription =
  "Discover and shop from African creators, students, and small sellers. Secure mobile money payments, integrated delivery, and trusted independent stores all in one marketplace.";

export const metadata: Metadata = {
  title: homeTitle,
  description: homeDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: homeTitle,
    description: homeDescription,
    url: "/",
  },
  twitter: {
    title: homeTitle,
    description: homeDescription,
  },
};

export default async function HomePage() {
  const headerList = await headers();
  const sessionPromise = auth.api.getSession({ headers: headerList });

  const { categories, stores, storesByCategory } =
    await marketplaceService.getHomePageData();

  const mapToMarketplaceStore = (s: StoreWithCategory): MarketplaceStore => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
    description: s.description,
    categories: s.categories || [],
    rating: 4.5, // TODO: Replace with real rating when available
    logoUrl: s.logoUrl ?? null,
    instagramAvatarUrl: s.instagramAvatarUrl ?? null,
    heroMedia: s.heroMedia ?? null,
    heroMediaType: s.heroMediaType ?? null,
    heroMediaItems: Array.isArray(s.heroMediaItems) ? s.heroMediaItems : [],
    images: Array.isArray(s.images) ? s.images : [],
  });

  const uiStores = stores.map(mapToMarketplaceStore);
  const uiStoresByCategory: Record<string, MarketplaceStore[]> = {};

  Object.entries(storesByCategory).forEach(([cat, list]) => {
    uiStoresByCategory[cat] = list.map(mapToMarketplaceStore);
  });

  // Sort categories to show populated ones first
  const sortedCategories = Object.entries(uiStoresByCategory)
    .sort(([, a], [, b]) => b.length - a.length)
    .slice(0, 6); // Limit to top 6 populated categories

  return (
    <PostHogProvider>
      <Providers>
        <Suspense
          fallback={
            <AppSessionProvider session={null}>
              <CartProvider>
                <main className="min-h-screen bg-background text-foreground">
                  <Header hideSearch />
                  <OneTapLogin />

                  <HeroSection />
                  <CollectionsRail
                    categories={categories.map((c) => ({
                      id: c.id,
                      name: c.name,
                      slug: c.slug,
                      image: (c as { image?: string | null })?.image ?? null,
                    }))}
                  />

                  {uiStores.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                      <h3 className="text-2xl font-semibold mb-4">
                        No stores yet
                      </h3>
                      <p className="text-muted-foreground mb-8">
                        Be the first to create a store on Vendly!
                      </p>
                      <Link href="/c">
                        <Button size="lg">Create Your Store</Button>
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4 pb-12">
                        {sortedCategories.map(
                          ([categoryName, categoryStores]) => (
                            <CategoryShelf
                              key={categoryName}
                              title={categoryName}
                              categorySlug={categoryName
                                .toLowerCase()
                                .replace(/\s+/g, "-")}
                              stores={categoryStores.slice(0, 12)}
                            />
                          ),
                        )}
                      </div>
                    </>
                  )}

                  <Footer />
                </main>
              </CartProvider>
            </AppSessionProvider>
          }
        >
          <SessionBoundary sessionPromise={sessionPromise}>
            <CartProvider>
              <main className="min-h-screen bg-background text-foreground">
                <Header hideSearch />
                <OneTapLogin />

                <HeroSection />
                <CollectionsRail
                  categories={categories.map((c) => ({
                    id: c.id,
                    name: c.name,
                    slug: c.slug,
                    image: (c as { image?: string | null })?.image ?? null,
                  }))}
                />

                {uiStores.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                    <h3 className="text-2xl font-semibold mb-4">
                      No stores yet
                    </h3>
                    <p className="text-muted-foreground mb-8">
                      Be the first to create a store on Vendly!
                    </p>
                    <Link href="/c">
                      <Button size="lg">Create Your Store</Button>
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 pb-12">
                      {sortedCategories.map(
                        ([categoryName, categoryStores]) => (
                          <CategoryShelf
                            key={categoryName}
                            title={categoryName}
                            categorySlug={categoryName
                              .toLowerCase()
                              .replace(/\s+/g, "-")}
                            stores={categoryStores.slice(0, 12)}
                          />
                        ),
                      )}
                    </div>
                  </>
                )}

                <Footer />
              </main>
            </CartProvider>
          </SessionBoundary>
        </Suspense>
      </Providers>
    </PostHogProvider>
  );
}

async function SessionBoundary({
  children,
  sessionPromise,
}: {
  children: ReactNode;
  sessionPromise: ReturnType<typeof auth.api.getSession>;
}) {
  const session = await sessionPromise;
  return <AppSessionProvider session={session}>{children}</AppSessionProvider>;
}
