"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CartItem {
    id: string;
    name: string;
    price: number;
    image: string;
    size?: string;
    quantity: number;
}

interface CartContextValue {
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
    addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    isOpen: boolean;
    toggleCart: () => void;
    closeCart: () => void;
    openCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            try {
                // Use setTimeout to avoid synchronous setState in effect
                setTimeout(() => setItems(JSON.parse(savedCart)), 0);
            } catch (error) {
                console.error("Failed to load cart from localStorage:", error);
            }
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(items));
    }, [items]);

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const addItem = (newItem: Omit<CartItem, "quantity"> & { quantity?: number }) => {
        setItems((prevItems) => {
            const existingItem = prevItems.find((item) =>
                item.id === newItem.id && item.size === newItem.size
            );

            const quantityToAdd = newItem.quantity || 1;

            if (existingItem) {
                return prevItems.map((item) =>
                    item.id === newItem.id && item.size === newItem.size
                        ? { ...item, quantity: item.quantity + quantityToAdd }
                        : item
                );
            }

            return [...prevItems, { ...newItem, quantity: quantityToAdd }];
        });
    };

    const removeItem = (id: string) => {
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(id);
            return;
        }

        setItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const toggleCart = () => setIsOpen(!isOpen);
    const closeCart = () => setIsOpen(false);
    const openCart = () => setIsOpen(true);

    return (
        <CartContext.Provider
            value={{
                items,
                totalItems,
                totalPrice,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                isOpen,
                toggleCart,
                closeCart,
                openCart,
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
