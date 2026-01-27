"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from 'next/link';

interface Category {
    slug: string;
    name: string;
    image: string | null;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function Categories() {
    const params = useParams();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<string>("all");

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

    if (loading) {
        return (
            <nav className="border-b border-neutral-200 bg-white">
                <div className="px-3 sm:px-4 lg:px-6 xl:px-8">
                    <div className="flex gap-8 overflow-x-auto scrollbar-hide py-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-5 w-20 bg-neutral-100 rounded animate-pulse shrink-0" />
                        ))}
                    </div>
                </div>
            </nav>
        );
    }

    if (categories.length === 0) return null;

    return (
        <nav className="border-b border-neutral-200 bg-white sticky top-0 z-10">
            <div className="px-3 sm:px-4 lg:px-6 xl:px-8">
                <div className="flex gap-6 sm:gap-8 overflow-x-auto scrollbar-hide">
                    {/* All/Featured link */}
                    <Link
                        href={`/${params?.storefront}`}
                        onClick={() => setActiveCategory("all")}
                        className={`
                            shrink-0 py-4 text-sm font-medium transition-colors relative
                            ${activeCategory === "all" 
                                ? "text-neutral-900" 
                                : "text-neutral-500 hover:text-neutral-700"
                            }
                        `}
                    >
                        Featured
                        {activeCategory === "all" && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900" />
                        )}
                    </Link>

                    {/* Category links */}
                    {categories.map((category) => (
                        <Link
                            key={category.slug}
                            href={`/${params?.storefront}/categories/${category.slug}`}
                            onClick={() => setActiveCategory(category.slug)}
                            className={`
                                shrink-0 py-4 text-sm font-medium transition-colors relative whitespace-nowrap
                                ${activeCategory === category.slug 
                                    ? "text-neutral-900" 
                                    : "text-neutral-500 hover:text-neutral-700"
                                }
                            `}
                        >
                            {category.name}
                            {activeCategory === category.slug && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900" />
                            )}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
}