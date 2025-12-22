import { useMemo } from "react";
import ShopGrid from "@/features/category-sections/components/ShopGrid";
import { useCategoryShops, type CategoryShops } from "@/features/category-sections/hooks/useCategoryShops";

export type ShopListingPageProps = {
  slug: string;
};

export default function ShopListingPage({ slug }: ShopListingPageProps) {
  const allCategories = useCategoryShops();
  
  const category = useMemo(() => {
    return allCategories.find(cat => cat.slug === slug);
  }, [allCategories, slug]);

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Category not found</h1>
        <p>The category "{slug}" does not exist.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{category.title}</h1>
      {category.shops.length > 0 ? (
        <ShopGrid shops={category.shops} />
      ) : (
        <p>No shops found in this category.</p>
      )}
    </div>
  );
}
