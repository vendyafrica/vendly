"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from 'next/link';
import Image from 'next/image';
import { CategoriesSkeleton } from "./skeletons";

interface Category {
    slug: string;
    name: string;
    image: string | null;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Fallback images for categories when no image is set
const FALLBACK_IMAGES = [
    "/images/green-bottle.png",
    "/images/woman-fashion.png",
    "/images/trench-coat.png",
    "/images/leather-loafers.png",
];

export function Categories() {
    const params = useParams();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            const slug = params?.storefront as string;
            if (!slug) {
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`${API_BASE}/api/storefront/${slug}/categories`);
                if (res.ok) {
                    setCategories(await res.json());
                }
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, [params?.storefront]);

    if (loading) return <CategoriesSkeleton />;

    // Don't render section if no categories
    if (categories.length === 0) {
        return (
            <section className="py-12 bg-[#F9F9F7]">
                <h2 className="text-2xl font-semibold mb-6 px-8 text-neutral-900">Featured</h2>
                <div className="w-full px-8">
                    <p className="text-neutral-500 text-sm">No categories available yet.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-12 bg-[#F9F9F7]">
            <h2 className="text-2xl font-semibold mb-6 px-8 text-neutral-900">Featured</h2>

            <div className="w-full px-8">
                <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
                    {categories.map((category, index) => (
                        <Link
                            key={category.slug}
                            href={`/categories/${category.slug}`}
                            className="group shrink-0"
                        >
                            <div className="relative w-[320px] aspect-4/3 rounded-lg overflow-hidden bg-neutral-200">
                                <Image
                                    src={category.image || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]}
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