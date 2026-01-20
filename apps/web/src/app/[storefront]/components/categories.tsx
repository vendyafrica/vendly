"use client";

import Link from 'next/link';
import Image from 'next/image';

export function Categories() {
    const categories = [
        {
            slug: "hoodies",
            name: "Hoodies",
            image: "/images/green-bottle.png",
        },
        {
            slug: "sweatpants",
            name: "Sweatpants",
            image: "/images/woman-fashion.png",
        },
        {
            slug: "all-products",
            name: "All Products",
            image: "/images/trench-coat.png",
        },
        {
            slug: "loungewear",
            name: "Loungewear",
            image: "/images/leather-loafers.png",
        },
    ]

    return (
        <section className="py-12 bg-[#F9F9F7]">
            <h2 className="text-2xl font-semibold mb-6 px-8 text-neutral-900">Featured</h2>
            
            <div className="w-full px-8">
                <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
                    {categories.map((category) => (
                        <Link
                            key={category.slug}
                            href={`/categories/${category.slug}`}
                            className="group shrink-0"
                        >
                            <div className="relative w-[320px] aspect-4/3 rounded-lg overflow-hidden bg-neutral-200">
                                <Image
                                    src={category.image}
                                    alt={category.name}
                                    fill
                                    sizes="320px"
                                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                                />
                            </div>

                            <p className="mt-4 text-sm uppercase tracking-wider font-bold text-neutral-900">
                                {category.name}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}