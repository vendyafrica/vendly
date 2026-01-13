"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "../../lib/utils";

interface Category {
    id: string;
    name: string;
    slug: string;
    icon?: string;
}

interface CategoryNavProps {
    categories: Category[];
    storeSlug: string;
    activeCategorySlug?: string;
    className?: string;
}

export function CategoryNav({
    categories,
    storeSlug,
    activeCategorySlug,
    className
}: CategoryNavProps) {
    return (
        <div className={cn("w-full overflow-x-auto pb-4 scrollbar-hide", className)}>
            <div className="flex items-center gap-3 px-4 md:px-8 min-w-max">
                <Link
                    href={`/${storeSlug}/products`}
                    className={cn(
                        "px-4 py-2 rounded-full text-sm font-medium transition-colors border",
                        !activeCategorySlug
                            ? "bg-[var(--primary,#111)] text-[var(--primary-foreground,#fff)] border-[var(--primary,#111)]"
                            : "bg-white text-[var(--foreground,#111)] border-gray-200 hover:border-gray-300"
                    )}
                >
                    All Products
                </Link>

                {categories.map((category) => (
                    <Link
                        key={category.id}
                        href={`/${storeSlug}/products?category=${category.slug}`}
                        className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium transition-colors border whitespace-nowrap",
                            activeCategorySlug === category.slug
                                ? "bg-[var(--primary,#111)] text-[var(--primary-foreground,#fff)] border-[var(--primary,#111)]"
                                : "bg-white text-[var(--foreground,#111)] border-gray-200 hover:border-gray-300"
                        )}
                    >
                        {category.name}
                    </Link>
                ))}
            </div>
        </div>
    );
}
