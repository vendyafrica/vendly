"use client";

import { CategorySelector, type Category } from "./tag-selector";

const CATEGORIES: Category[] = [
  { id: "men", label: "Men" },
  { id: "women", label: "Women" },
  { id: "beauty", label: "Beauty" },
  { id: "accessories", label: "Accessories" },
  { id: "home", label: "Home & Living" },
  { id: "food", label: "Food & Nutrition" },
  { id: "health", label: "Health & Wellness" },
  { id: "kids", label: "Kids & Baby" },
  { id: "electronics", label: "Electronics" },
  { id: "sports", label: "Sports & Outdoors" },
];

interface CategoriesSelectorProps {
  selectedCategories: string[];
  onChange: (categories: string[]) => void;
}

export default function CategoriesSelector({
  selectedCategories,
  onChange,
  availableCategories = [],
}: CategoriesSelectorProps & { availableCategories?: Category[] }) {
  const selected = availableCategories.filter((c) => selectedCategories.includes(c.id));

  const handleChange = (categories: Category[]) => {
    onChange(categories.map((c) => c.id));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h1 className="text-xl font-semibold">What do you sell?</h1>
        <p className="text-sm text-muted-foreground">
          Select the categories that best describe your products
        </p>
      </div>

      <CategorySelector
        categories={availableCategories}
        selectedCategories={selected}
        onChange={handleChange}
        maxSelections={5}
      />
    </div>
  );
}

export { CATEGORIES };
