import { MarketplaceGridSkeleton } from "@/app/(platform)/components/MarketplaceGridSkeleton";
import { CategoryTitleSkeleton } from "@/app/(platform)/components/CategoryTitleSkeleton";
import Header from "@/app/(platform)/components/header";
import Footer from "@/app/(platform)/components/footer";

export default function Loading() {
  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <section key={index} className="mb-12">
            <CategoryTitleSkeleton />
            <MarketplaceGridSkeleton />
          </section>
        ))}
      </div>

      <Footer />
    </main>
  );
}
