"use client";

import { useMemo, Suspense, useEffect } from "react";
import { signInWithOneTap } from "@/lib/auth";
import Link from "next/link";
import { MarketplaceGrid } from "@/components/marketplace/MarketplaceGrid";
import { MarketplaceGridSkeleton } from "@/components/marketplace/MarketplaceGridSkeleton";
import { CategoryOverview } from "@/components/marketplace/CategoryOverview";
import Header from "@/components/marketplace/header";
import Footer from "@/components/marketplace/footer";
import { useStores } from "@/hooks/useStores";
import { categories, type Category } from "@/constants/stores";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";

function MarketplaceContent() {
  const { stores, loading } = useStores();
  const storesByCategory = useMemo(() => {
    const grouped: Record<Category, typeof stores> = {} as Record<Category, typeof stores>;

    categories.forEach(category => {
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
        {categories.map((category) => (
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
            <Suspense fallback={<MarketplaceGridSkeleton />}>
              <MarketplaceGrid stores={storesByCategory[category]} loading={loading} />
            </Suspense>
          </section>
        ))}
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
      <Suspense fallback={<MarketplaceGridSkeleton />}>
        <MarketplaceContent />
      </Suspense>
      <Footer />
    </main>
  );
}