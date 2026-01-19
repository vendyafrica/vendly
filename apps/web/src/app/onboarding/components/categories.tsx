"use client"

import { useState } from "react";
import { CategorySelector, type Category } from "./tag-selector";
import { Button } from "@vendly/ui/components/button";

const categories: Category[] = [
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

export default function CategoriesSelector() {
    const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

    const handleContinue = () => {
        console.log("Selected categories:", selectedCategories.map(c => c.id));
    };

    return (
        <div className="mx-auto w-full max-w-lg rounded-xl p-6 md:p-8 shadow-md">
            <div className="space-y-6">
                <div className="space-y-2">
                    <h1 className="text-xl font-semibold">
                        What do you sell?
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Select the categories that best describe your products
                    </p>
                </div>

                <CategorySelector
                    categories={categories}
                    selectedCategories={selectedCategories}
                    onChange={setSelectedCategories}
                    maxSelections={5}
                />

                <div className="flex items-center justify-between pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        className="bg-muted hover:bg-red-400 hover:text-white border-0"
                    >
                        Back
                    </Button>

                    <Button
                        type="button"
                        onClick={handleContinue}
                        className="bg-primary hover:bg-primary/90 hover:text-white disabled:opacity-50"
                    >
                        Continue
                    </Button>
                </div>
            </div>
        </div>
    );
}
