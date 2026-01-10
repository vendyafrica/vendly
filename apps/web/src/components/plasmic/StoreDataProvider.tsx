"use client";

import { usePlasmicQueryData, DataProvider } from "@plasmicapp/loader-nextjs";
import type { ReactNode } from "react";

interface StoreData {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    logoUrl: string | null;
    theme: {
        primaryColor: string;
        secondaryColor: string;
        accentColor: string;
        backgroundColor: string;
        textColor: string;
        headingFont: string;
        bodyFont: string;
    };
    content: Record<string, any>;
}

interface StoreDataProviderProps {
    storeSlug: string;
    children: ReactNode;
    className?: string;
}

/**
 * Fetches store data and provides it to child components via DataProvider.
 * Use dynamic values in Plasmic Studio to access the store data.
 */
export function StoreDataProvider({
    storeSlug,
    children,
    className,
}: StoreDataProviderProps) {
    const { data, isLoading, error } = usePlasmicQueryData<StoreData>(
        `/store/${storeSlug}`,
        async () => {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const resp = await fetch(`${apiUrl}/api/storefront/${storeSlug}`);
            if (!resp.ok) {
                throw new Error("Failed to fetch store data");
            }
            return resp.json();
        }
    );

    if (isLoading) {
        return (
            <div className={className}>
                <div className="animate-pulse">Loading store...</div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className={className}>
                <div className="text-red-500">Failed to load store data</div>
            </div>
        );
    }

    return (
        <DataProvider name="store" data={data}>
            <div className={className}>{children}</div>
        </DataProvider>
    );
}
