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
  // Add "All" category at the beginning
  const allCategories = [
    { id: "all", name: "All", slug: "all", imageUrl: null },
    ...categories,
  ];

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="border-b border-border bg-background/50 backdrop-blur-sm sticky top-16 z-40">
      <div className="container mx-auto px-4">
        <div className="flex space-x-8 py-4 overflow-x-auto scrollbar-hide">
          {allCategories.map((category) => {
            const isActive = selectedCategory 
              ? selectedCategory === category.slug 
              : category.slug === "all";
            
            return (
              <Link
                key={category.id}
                href={
                  category.slug === "all" 
                    ? `/${storeSlug}`
                    : `/${storeSlug}/categories/${category.slug}`
                }
                className={`whitespace-nowrap pb-4 border-b-2 font-medium text-sm transition-colors ${
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
                }`}
              >
                {category.name}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
