"use client";

import { useMemo, Suspense, useEffect } from "react";
import { signInWithOneTap } from "@/lib/auth";
import Link from "next/link";
import { MarketplaceGrid } from "@/components/marketplace/MarketplaceGrid";
import { CategorySectionSkeleton } from "@/components/marketplace/CategorySectionSkeleton";
import { CategoryOverview } from "@/components/marketplace/CategoryOverview";
import Header from "@/components/marketplace/header";
import Footer from "@/components/marketplace/footer";
import { useStores } from "@/hooks/useStores";
import { MARKETPLACE_CATEGORIES, type MarketplaceCategory } from "@/types/marketplace";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";

function MarketplaceContent() {
  const { stores, loading } = useStores();
  const storesByCategory = useMemo(() => {
    const grouped: Record<MarketplaceCategory, typeof stores> = {} as Record<MarketplaceCategory, typeof stores>;

    MARKETPLACE_CATEGORIES.forEach((category: MarketplaceCategory) => {
      grouped[category] = [];
    });

    stores.forEach((store) => {
      grouped[store.category].push(store);
    });

    return grouped;
  }, [stores]);

  return (
    <>
      <CategoryOverview />

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          // Show skeleton for all categories while loading
          MARKETPLACE_CATEGORIES.map((category: MarketplaceCategory) => (
            <CategorySectionSkeleton key={category} />
          ))
        ) : (
          // Show actual data once loaded
          MARKETPLACE_CATEGORIES.map((category: MarketplaceCategory) => (
            <section key={category} className="mb-12">
              <Link
                href={`/category/${category.toLowerCase()}`}
                className="group inline-flex items-center ml-9 mb-4"
              >
                <h2 className="text-2xl font-semibold text-gray-900 group-hover:text-gray-600 transition-colors flex items-center">
                  {category}
                  <HugeiconsIcon
                    icon={ArrowRight02Icon}
                    className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                  />
                </h2>
              </Link>
              <MarketplaceGrid stores={storesByCategory[category]} loading={false} />
            </section>
          ))
        )}
      </div>
    </>
  );
}

export default function Page() {
  useEffect(() => {
    const timer = setTimeout(() => {
      void signInWithOneTap();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Suspense fallback={
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          {MARKETPLACE_CATEGORIES.map((category: MarketplaceCategory) => (
            <CategorySectionSkeleton key={category} />
          ))}
        </div>
      }>
        <MarketplaceContent />
      </Suspense>
      <Footer />
    </main>
  );
}
