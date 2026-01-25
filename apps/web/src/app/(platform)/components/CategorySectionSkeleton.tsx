"use client";

import { StoreCardSkeleton } from "./StoreCardSkeleton";

interface CategorySectionSkeletonProps {
    mobileCount?: number;
    desktopCount?: number;
}

export function CategorySectionSkeleton({
    mobileCount = 6,
    desktopCount = 10,
}: CategorySectionSkeletonProps = {}) {
    return (
        <section className="mb-12">
            {/* Category Title Skeleton */}
            <div className="ml-9 mb-4">
                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
            </div>

            {/* Mobile Grid */}
            <div className="grid grid-cols-2 gap-4 md:hidden">
                {Array.from({ length: mobileCount }).map((_, index) => (
                    <StoreCardSkeleton key={index} />
                ))}
            </div>

            {/* Desktop Grid */}
            <div className="hidden md:block">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-5 gap-4">
                        {Array.from({ length: desktopCount }).map((_, index) => (
                            <StoreCardSkeleton key={index} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
