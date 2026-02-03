"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAppSession } from "./app-session-context";

// Use relative paths for same-origin API calls (Next.js serverless routes)
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

export interface CartItem {
    id: string; // Product ID
    quantity: number;
    product: {
        id: string;
        name: string;
        price: number;
        currency: string;
        image?: string;
        slug: string;
    };
    store: {
        id: string;
        name: string;
        slug: string;
        logoUrl?: string | null;
    };
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    clearStoreFromCart: (storeId: string) => void;
    cartTotal: number;
    itemCount: number;
    itemsByStore: Record<string, CartItem[]>; // Grouped by storeId
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const { session } = useAppSession();
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Initial Load
    useEffect(() => {
        const loadCart = async () => {
            if (session?.user) {
                try {
                    const res = await fetch(`${API_BASE}/api/cart`, {
                        headers: { "x-user-id": session.user.id }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setItems(data);
                    }
                } catch (e) {
                    console.error("Failed to fetch cart", e);
                }
            } else {
                const stored = localStorage.getItem("vendly_cart");
                if (stored) {
                    try {
                        setItems(JSON.parse(stored));
                    } catch (e) {
                        console.error("Failed to parse cart storage", e);
                    }
                }
            }
            setIsLoaded(true);
        };
        loadCart();
    }, [session]);

    // Save changes
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("vendly_cart", JSON.stringify(items));
        }
    }, [items, isLoaded]);

    const addItem = async (newItem: Omit<CartItem, "quantity">, quantity = 1) => {
        // Optimistic update
        setItems((prev) => {
            const existing = prev.find((item) => item.id === newItem.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === newItem.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { ...newItem, quantity }];
        });

        if (session?.user) {
            // Find the new quantity
            const currentItem = items.find(i => i.id === newItem.id);
            const newQuantity = (currentItem?.quantity || 0) + quantity;

            try {
                await fetch(`${API_BASE}/api/cart`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-user-id": session.user.id
                    },
                    body: JSON.stringify({
                        productId: newItem.product.id,
                        storeId: newItem.store.id,
                        quantity: newQuantity
                    })
                });
            } catch (e) {
                console.error("Failed to sync cart add", e);
            }
        }
    };

    const removeItem = async (productId: string) => {
        setItems((prev) => prev.filter((item) => item.id !== productId));

        if (session?.user) {
            try {
                await fetch(`${API_BASE}/api/cart/items/${productId}`, {
                    method: "DELETE",
                    headers: { "x-user-id": session.user.id }
                });
            } catch (e) {
                console.error("Failed to sync cart remove", e);
            }
        }
    };

    const updateQuantity = async (productId: string, quantity: number) => {
        if (quantity < 1) {
            removeItem(productId);
            return;
        }

        const item = items.find(i => i.id === productId);
        if (!item) return;

        setItems((prev) =>
            prev.map((item) =>
                item.id === productId ? { ...item, quantity } : item
            )
        );

        if (session?.user) {
            try {
                await fetch(`${API_BASE}/api/cart`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-user-id": session.user.id
                    },
                    body: JSON.stringify({
                        productId: item.product.id,
                        storeId: item.store.id,
                        quantity
                    })
                });
            } catch (e) {
                console.error("Failed to sync cart update", e);
            }
        }
    };

    const clearCart = async () => {
        setItems([]);
        if (session?.user) {
            try {
                await fetch(`${API_BASE}/api/cart`, {
                    method: "DELETE",
                    headers: { "x-user-id": session.user.id }
                });
            } catch (e) {
                console.error("Failed to sync clear cart", e);
            }
        }
    };

    const clearStoreFromCart = async (storeId: string) => {
        setItems((prev) => prev.filter((item) => item.store.id !== storeId));
        if (session?.user) {
            try {
                await fetch(`${API_BASE}/api/cart?storeId=${storeId}`, {
                    method: "DELETE",
                    headers: { "x-user-id": session.user.id }
                });
            } catch (e) {
                console.error("Failed to sync clear store cart", e);
            }
        }
    };

    const cartTotal = items.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
    );

    const itemCount = items.reduce((count, item) => count + item.quantity, 0);

    const itemsByStore = items.reduce((groups, item) => {
        const storeId = item.store.id;
        if (!groups[storeId]) {
            groups[storeId] = [];
        }
        groups[storeId].push(item);
        return groups;
    }, {} as Record<string, CartItem[]>);

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                clearStoreFromCart,
                cartTotal,
                itemCount,
                itemsByStore,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
