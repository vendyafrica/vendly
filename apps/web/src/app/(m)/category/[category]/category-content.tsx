"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft02Icon, Store01Icon } from "@hugeicons/core-free-icons";

type Category = string;

interface CategoryContentProps {
    category: Category;
}

export function CategoryContent({ category }: CategoryContentProps) {
    // Replaced dynamic fetching with static placeholder
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
                <Link href="/" className="hover:text-gray-900 transition-colors">
                    Home
                </Link>
                <span>/</span>
                <span className="text-gray-900 font-medium capitalize">{category}</span>
            </nav>

            <div className="text-center py-20">
                <div className="text-gray-400 mb-4">
                    <HugeiconsIcon icon={Store01Icon} size={48} className="mx-auto" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    Category: {category}
                </h2>
                <p className="text-gray-600 mb-6">
                    Browsing categories is currently disabled.
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
                >
                    <HugeiconsIcon icon={ArrowLeft02Icon} size={20} />
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
