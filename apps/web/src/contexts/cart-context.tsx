"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export interface CartItem {
    id: string; // unique cart item id
    productId: string;
    storeId: string;
    storeName: string;
    storeSlug: string;
    name: string;
    variant?: string; // e.g., "Off-white / XXS"
    price: number;
    currency: string;
    quantity: number;
    image?: string;
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: Omit<CartItem, "id">) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    getItemsByStore: () => Map<string, CartItem[]>;
    itemCount: number;
    subtotal: number;
    currency: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "vendly_cart";

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(CART_STORAGE_KEY);
            if (stored) {
                setItems(JSON.parse(stored));
            }
        } catch (e) {
            console.error("Failed to load cart:", e);
        }
        setIsLoaded(true);
    }, []);

    // Persist cart to localStorage
    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
            } catch (e) {
                console.error("Failed to save cart:", e);
            }
        }
    }, [items, isLoaded]);

    const addItem = useCallback((item: Omit<CartItem, "id">) => {
        setItems((prev) => {
            // Check if item already exists (same product + variant)
            const existing = prev.find(
                (i) => i.productId === item.productId && i.variant === item.variant
            );

            if (existing) {
                // Update quantity
                return prev.map((i) =>
                    i.id === existing.id
                        ? { ...i, quantity: i.quantity + item.quantity }
                        : i
                );
            }

            // Add new item
            const newItem: CartItem = {
                ...item,
                id: `${item.productId}-${item.variant || "default"}-${Date.now()}`,
            };
            return [...prev, newItem];
        });
    }, []);

    const removeItem = useCallback((id: string) => {
        setItems((prev) => prev.filter((i) => i.id !== id));
    }, []);

    const updateQuantity = useCallback((id: string, quantity: number) => {
        if (quantity < 1) {
            removeItem(id);
            return;
        }
        setItems((prev) =>
            prev.map((i) => (i.id === id ? { ...i, quantity } : i))
        );
    }, [removeItem]);

    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    const getItemsByStore = useCallback(() => {
        const grouped = new Map<string, CartItem[]>();
        items.forEach((item) => {
            const existing = grouped.get(item.storeId) || [];
            grouped.set(item.storeId, [...existing, item]);
        });
        return grouped;
    }, [items]);

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const currency = items[0]?.currency || "KES";

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                getItemsByStore,
                itemCount,
                subtotal,
                currency,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
