import { Suspense } from "react";
import Link from "next/link";
import { MarketplaceGridSkeleton } from "@/components/marketplace/MarketplaceGridSkeleton";
import type { Category } from "@/constants/stores";
import { categories } from "@/constants/stores";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft02Icon, Store01Icon } from "@hugeicons/core-free-icons";
import Header from "@/app/(platform)/components/header";
import Footer from "@/app/(platform)/components/footer";
import { CategoryContent } from "./category-content";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  // Await params in Next.js 15+
  const resolvedParams = await params;

  // Capitalize the first letter to match the Category type
  const categoryParam = resolvedParams.category;
  const category = (categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)) as Category;

  // Check if it's a valid category
  if (!categories.includes(category)) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="text-gray-400 mb-4">
                <HugeiconsIcon icon={Store01Icon} size={48} className="mx-auto" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Category Not Found
              </h1>
              <p className="text-gray-600 mb-6">
                The category &quot;{categoryParam}&quot; doesn&apos;t exist.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
              >
                <HugeiconsIcon icon={ArrowLeft02Icon} size={20} />
                Back to Marketplace
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Suspense fallback={
        <div className="max-w-7xl mx-auto">
          <div className="border-b border-gray-200 bg-white">
            <div className="px-4 sm:px-6 lg:px-8 py-8">
              <div className="w-32 h-6 bg-gray-200 rounded animate-pulse mb-6" />
              <div className="w-48 h-10 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="w-64 h-6 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
          <MarketplaceGridSkeleton />
        </div>
      }>
        <CategoryContent category={category} />
      </Suspense>
      <Footer />
    </main>
  );
}
