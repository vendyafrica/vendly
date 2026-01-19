"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@vendly/ui/components/button";
import { MinusSignIcon, PlusSignIcon, Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

// Mock Data
const INITIAL_CART_ITEMS = [
    {
        id: "1",
        storeName: "My Custom Store",
        title: "Classic Trench Coat",
        size: "M",
        color: "Beige",
        price: 250,
        quantity: 1,
        image: "/images/trench-coat.png",
    },
    {
        id: "2",
        storeName: "Nike",
        title: "Air Force 1",
        size: "US 10",
        color: "White",
        price: 120,
        quantity: 1,
        image: "/images/shoes.png",
    },
];

export default function CartPage() {
    const [cartItems, setCartItems] = useState(INITIAL_CART_ITEMS);

    const updateQuantity = (id: string, delta: number) => {
        setCartItems(prevItems => prevItems.map(item => {
            if (item.id === id) {
                const newQuantity = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQuantity };
            }
            return item;
        }));
    };

    const removeItem = (id: string) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = 0; // Simplified for now
    const total = subtotal + tax;

    return (
        <div className="flex flex-col lg:flex-row gap-12">

            {/* Left: Cart Items */}
            <div className="flex-1">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-semibold font-serif">Shopping Bag</h1>
                    <span className="text-sm text-neutral-500">{cartItems.length} items</span>
                </div>

                <div className="space-y-8">
                    {cartItems.length === 0 ? (
                        <div className="text-center py-12 border rounded-xl border-dashed border-neutral-200">
                            <p className="text-neutral-500 mb-4">Your bag is empty.</p>
                            <Link href="/" className="text-black underline">Continue Shopping</Link>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item.id} className="flex gap-6 py-6 border-b border-neutral-100 last:border-0">
                                {/* Image */}
                                <div className="relative w-32 h-40 bg-neutral-100 rounded-lg overflow-hidden shrink-0">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover mix-blend-multiply"
                                    />
                                </div>

                                {/* Details */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                {/* Store Attribution */}
                                                <Link href="#" className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1 hover:underline">
                                                    Sold by {item.storeName}
                                                </Link>
                                                <h3 className="text-lg font-medium text-black mt-1">{item.title}</h3>
                                            </div>
                                            <p className="text-lg font-medium text-black">${item.price * item.quantity}</p>
                                        </div>
                                        <p className="text-sm text-neutral-500 mt-2">
                                            Size: {item.size} • Color: {item.color}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        {/* Quantity */}
                                        <div className="flex items-center gap-4 rounded-full border border-neutral-200 px-3 py-1">
                                            <button
                                                onClick={() => updateQuantity(item.id, -1)}
                                                className="p-1 hover:text-black text-neutral-500 transition disabled:opacity-50"
                                                disabled={item.quantity <= 1}
                                            >
                                                <HugeiconsIcon icon={MinusSignIcon} size={16} />
                                            </button>
                                            <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, 1)}
                                                className="p-1 hover:text-black text-neutral-500 transition"
                                            >
                                                <HugeiconsIcon icon={PlusSignIcon} size={16} />
                                            </button>
                                        </div>

                                        {/* Remove */}
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-sm text-neutral-400 hover:text-red-500 transition flex items-center gap-2"
                                        >
                                            <HugeiconsIcon icon={Delete02Icon} size={18} />
                                            <span className="hidden sm:inline">Remove</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )))}
                </div>
            </div>

            {/* Right: Order Summary */}
            <div className="w-full lg:w-96 shrink-0">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-100 sticky top-24">
                    <h2 className="text-lg font-medium font-serif mb-6">Order Summary</h2>

                    <div className="space-y-4 mb-6">
                        <div className="flex justify-between text-sm">
                            <span className="text-neutral-500">Subtotal</span>
                            <span className="font-medium">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-neutral-500">Shipping Estimate</span>
                            <span className="text-green-600 font-medium">Free</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-neutral-500">Tax</span>
                            <span className="font-medium">$0.00</span>
                        </div>
                    </div>

                    <div className="border-t border-neutral-100 pt-4 mb-8">
                        <div className="flex justify-between items-end">
                            <span className="text-base font-medium">Total</span>
                            <span className="text-2xl font-serif font-medium">${total.toFixed(2)}</span>
                        </div>
                    </div>

                    <Button className="w-full h-12 rounded-full text-base font-medium bg-black text-white hover:bg-neutral-800" disabled={cartItems.length === 0}>
                        Checkout
                    </Button>

                    <p className="text-xs text-center text-neutral-400 mt-4">
                        Secure Checkout powered by Vendly
                    </p>
                </div>
            </div>
        </div>
    );
}
