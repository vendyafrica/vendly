"use client";

import { useMemo } from "react";
import { MarketplaceGrid } from "@/components/marketplace/MarketplaceGrid";
import Header from "@/components/marketplace/header";
import Footer from "@/components/marketplace/footer";
import { stores, categories, type Category } from "@/constants/stores";

export default function Page() {
  const storesByCategory = useMemo(() => {
    const grouped: Record<Category, typeof stores> = {} as Record<Category, typeof stores>;
    
    // Initialize all categories with empty arrays
    categories.forEach(category => {
      grouped[category] = [];
    });

    // Group stores by category
    stores.forEach((store) => {
      grouped[store.category].push(store);
    });

    return grouped;
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {categories.map((category) => (
          <section key={category} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{category}</h2>
            <MarketplaceGrid stores={storesByCategory[category]} />
          </section>
        ))}
      </div>
      
      <Footer />
    </main>
  );
}