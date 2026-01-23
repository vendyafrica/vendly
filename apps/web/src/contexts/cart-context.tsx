"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

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
    const [items, setItems] = useState<CartItem[]>([]);

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem("vendly_cart");
        if (stored) {
            try {
                setItems(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse cart storage", e);
            }
        }
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        localStorage.setItem("vendly_cart", JSON.stringify(items));
    }, [items]);

    const addItem = (newItem: Omit<CartItem, "quantity">, quantity = 1) => {
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
    };

    const removeItem = (productId: string) => {
        setItems((prev) => prev.filter((item) => item.id !== productId));
    };

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity < 1) {
            removeItem(productId);
            return;
        }
        setItems((prev) =>
            prev.map((item) =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const clearStoreFromCart = (storeId: string) => {
        setItems((prev) => prev.filter((item) => item.store.id !== storeId));
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
