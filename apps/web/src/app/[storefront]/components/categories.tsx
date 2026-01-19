"use client";

import Image from "next/image";
import Link from 'next/link';
import { StoreCategoriesConfig } from "../../../types/store-config";
import { cn, themeClasses, animations } from "../../../lib/theme-utils";

interface CategoriesProps {
    config: StoreCategoriesConfig;
}

export function Categories({ config }: CategoriesProps) {
    const { title, items } = config;

    // Default categorized images if none provided (fallback or just rely on config)
    // For now, we rely on config.

    return (
        <section className="py-16">
            <h2 className={cn("text-2xl font-light mb-8", themeClasses.text.default)}>{title}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {items.map((category) => (
                    <Link
                        key={category.slug}
                        href={`/categories/${category.slug}`}
                        className={cn("group flex flex-col gap-2", animations.transition)}
                    >
                        <div className={cn(
                            "relative aspect-square rounded-(--radius)] overflow-hidden",
                            themeClasses.background.muted,
                            animations.hover
                        )}>
                            <Image
                                src={category.imageUrl}
                                alt={category.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="text-center">
                            <h3 className={cn("text-sm font-medium", themeClasses.text.default)}>
                                {category.name}
                            </h3>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}