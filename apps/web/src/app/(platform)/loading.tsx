import { MarketplaceGridSkeleton } from "@/components/marketplace/MarketplaceGridSkeleton";
import { CategoryTitleSkeleton } from "@/components/ui/skeleton-parts";
import Header from "@/components/marketplace/header";
import Footer from "@/components/marketplace/footer";

export default function Loading() {
  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Skeleton for category sections */}
        {Array.from({ length: 3 }).map((_, index) => (
          <section key={index} className="mb-12">
            {/* Category title skeleton */}
            <CategoryTitleSkeleton />
            
            {/* Marketplace grid skeleton */}
            <MarketplaceGridSkeleton />
          </section>
        ))}
      </div>

      <Footer />
    </main>
  );
}
