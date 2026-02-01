"use client";

import { useState, useEffect, useCallback } from "react";

export interface RecentItem {
    id: string;
    name: string;
    price: number;
    currency: string;
    image: string;
    store: {
        name: string;
        slug: string;
    };
    slug: string;
    viewedAt: number;
}

const MAX_RECENT_ITEMS = 20;
const STORAGE_KEY = "vendly_recent_items";

export function useRecentlyViewed() {
    const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load items on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setRecentItems(JSON.parse(stored));
            }
        } catch (error) {
            console.error("Failed to load recently viewed items", error);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    const addToRecentlyViewed = useCallback((item: Omit<RecentItem, "viewedAt">) => {
        setRecentItems((prev) => {
            const newItem = { ...item, viewedAt: Date.now() };
            // Remove existing item if it exists (to move it to top)
            const filtered = prev.filter((i) => i.id !== newItem.id);
            // Add new item to front
            const updated = [newItem, ...filtered].slice(0, MAX_RECENT_ITEMS);

            // Persist to storage
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            } catch (error) {
                console.error("Failed to save recently viewed item", error);
            }

            return updated;
        });
    }, []);

    const clearRecentlyViewed = useCallback(() => {
        setRecentItems([]);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    return {
        recentItems,
        addToRecentlyViewed,
        clearRecentlyViewed,
        isLoaded
    };
}
