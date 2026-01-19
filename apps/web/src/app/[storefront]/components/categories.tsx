"use client";

import Image from "next/image";
import Link from 'next/link';
import { StoreCategoriesConfig } from "@vendly/ui/src/types/store-config";

interface CategoriesProps {
    config: StoreCategoriesConfig;
}

export function Categories({ config }: CategoriesProps) {
    const { title, items } = config;

    // Default categorized images if none provided (fallback or just rely on config)
    // For now, we rely on config.

    return (
        <section className="py-16">
            <h2 className="text-2xl font-light mb-8 text-black">{title}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {items.map((category) => (
                    <Link
                        key={category.slug}
                        href={`/categories/${category.slug}`}
                        className="group flex flex-col gap-2"
                    >
                        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
                            <Image
                                src={category.imageUrl}
                                alt={category.name}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                        <div className="text-center">
                            <h3 className="text-sm font-medium text-black">{category.name}</h3>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}