"use client";

import { useEffect, useState } from "react";

export interface WishlistItem {
    id: string;
    name: string;
    price: number;
    currency: string;
    image?: string;
    slug?: string;
    store?: {
        id?: string;
        name?: string;
        slug?: string;
    };
}

const STORAGE_KEY = "vendly_wishlist";

function loadWishlist(): WishlistItem[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = window.sessionStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        return JSON.parse(raw) as WishlistItem[];
    } catch {
        return [];
    }
}

function persistWishlist(items: WishlistItem[]) {
    if (typeof window === "undefined") return;
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function useWishlist() {
    const [items, setItems] = useState<WishlistItem[]>(() => loadWishlist());

    useEffect(() => {
        if (items) {
            persistWishlist(items);
        }
    }, [items]);

    const isInWishlist = (id: string) => items.some((item) => item.id === id);

    const toggleWishlist = (item: WishlistItem) => {
        setItems((prev) => {
            const exists = prev.some((i) => i.id === item.id);
            if (exists) {
                return prev.filter((i) => i.id !== item.id);
            }
            return [...prev, item];
        });
    };

    const removeFromWishlist = (id: string) => {
        setItems((prev) => prev.filter((i) => i.id !== id));
    };

    return { items, isInWishlist, toggleWishlist, removeFromWishlist };
}
