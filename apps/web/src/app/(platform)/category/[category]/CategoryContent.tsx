"use client";

import Link from "next/link";
import { MarketplaceGrid } from "@/components/marketplace/MarketplaceGrid";
import { MarketplaceGridSkeleton } from "@/components/marketplace/MarketplaceGridSkeleton";
import { useMockCategoryStores } from "@/hooks/useMockCategoryStores";
import type { Category } from "@/constants/stores";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft02Icon, Store01Icon } from "@hugeicons/core-free-icons";

interface CategoryContentProps {
    category: Category;
}

export function CategoryContent({ category }: CategoryContentProps) {
    const { stores, loading, error } = useMockCategoryStores(category);
    const storeCount = stores.length;

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center py-20">
                    <div className="text-red-500 mb-4">
                        <HugeiconsIcon icon={Store01Icon} size={48} className="mx-auto" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                        Unable to load stores
                    </h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
                        <Link href="/" className="hover:text-gray-900 transition-colors">
                            Home
                        </Link>
                        <span>/</span>
                        <span className="text-gray-900 font-medium capitalize">{category}</span>
                    </nav>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900 mb-2 capitalize">
                                {category}
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="max-w-7xl mx-auto">
                    <MarketplaceGridSkeleton />
                </div>
            ) : storeCount === 0 ? (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="text-center py-20">
                        <div className="text-gray-400 mb-4">
                            <HugeiconsIcon icon={Store01Icon} size={48} className="mx-auto" />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            No stores yet
                        </h2>
                        <p className="text-gray-600 mb-6">
                            There are currently no stores in the {category.toLowerCase()} category.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
                        >
                            <HugeiconsIcon icon={ArrowLeft02Icon} size={20} />
                            Browse All Categories
                        </Link>
                    </div>
                </div>
            ) : (
                <MarketplaceGrid stores={stores} loading={false} />
            )}
        </>
    );
}
