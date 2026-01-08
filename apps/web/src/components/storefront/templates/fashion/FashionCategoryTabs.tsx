"use client";

import { useState } from "react";

export interface FashionCategoryTabsProps {
    categories: string[];
    showSection?: boolean;
    onCategoryChange?: (category: string) => void;
}

export function FashionCategoryTabs({
    categories = ["Women", "Men"],
    showSection = true,
    onCategoryChange,
}: FashionCategoryTabsProps) {
    const [activeCategory, setActiveCategory] = useState(categories[0] || "Women");

    if (!showSection || categories.length === 0) {
        return null;
    }

    const handleCategoryClick = (category: string) => {
        setActiveCategory(category);
        onCategoryChange?.(category);
    };

    return (
        <section className="py-6 bg-white border-b">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex items-center justify-center gap-8">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => handleCategoryClick(category)}
                            className={`
                relative text-sm font-medium uppercase tracking-widest pb-2 transition-colors
                ${activeCategory === category
                                    ? "text-black"
                                    : "text-gray-400 hover:text-gray-600"
                                }
              `}
                        >
                            {category}
                            {activeCategory === category && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default FashionCategoryTabs;
