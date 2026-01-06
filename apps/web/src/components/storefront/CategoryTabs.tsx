"use client";

import { useState } from "react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
}

interface CategoryTabsProps {
  storeSlug: string;
  categories: Category[];
  selectedCategory?: string;
}

export function CategoryTabs({ storeSlug, categories, selectedCategory }: CategoryTabsProps) {
  const [activeTab, setActiveTab] = useState(selectedCategory || "all");
  
  // Add "All" category at the beginning
  const allCategories = [
    { id: "all", name: "All", slug: "all", imageUrl: null },
    ...categories,
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-2">
            New Arrivals
          </h2>
          <div className="w-12 h-0.5 bg-gray-900 mx-auto" />
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-8 md:gap-12 overflow-x-auto pb-2 scrollbar-hide">
            {allCategories.map((category) => {
              const isActive = activeTab === category.slug;
              
              return (
                <Link
                  key={category.id}
                  href={
                    category.slug === "all" 
                      ? `/${storeSlug}`
                      : `/${storeSlug}/categories/${category.slug}`
                  }
                  onClick={() => setActiveTab(category.slug)}
                  className={`whitespace-nowrap text-sm font-medium tracking-wide uppercase transition-colors pb-2 border-b-2 ${
                    isActive
                      ? "border-gray-900 text-gray-900"
                      : "border-transparent text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {category.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
