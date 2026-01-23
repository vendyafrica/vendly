"use client";

import Link from "next/link";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon, MinusSignIcon, PlusSignIcon, ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@vendly/ui/components/button";
import { useCart } from "../../../contexts/cart-context";

export default function CartPage() {
    const { items, itemsByStore, updateQuantity, removeItem, cartTotal, itemCount, addItem } = useCart();

    // Mock data function for testing
    const loadMockData = () => {
        const mockStore1 = { id: "store_1", name: "Lamarel", slug: "lamarel" };
        const mockStore2 = { id: "store_2", name: "Urban Outfit", slug: "urban-outfit" };

        const mockProduct1 = {
            id: "prod_1",
            name: "MERINO WOOL CABLE-KNIT SWEATER",
            price: 229.90,
            currency: "€",
            slug: "merino-wool-sweater",
            image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000&auto=format&fit=crop"
        };

        const mockProduct2 = {
            id: "prod_2",
            name: "LAMAREL CAP",
            price: 49.90,
            currency: "€",
            slug: "lamarel-cap",
            image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1000&auto=format&fit=crop"
        };

        const mockProduct3 = {
            id: "prod_3",
            name: "Vintage Denim Jacket",
            price: 89.00,
            currency: "$",
            slug: "vintage-denim",
            image: "https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?q=80&w=1000&auto=format&fit=crop"
        };

        addItem({ id: "item_1", product: mockProduct1, store: mockStore1 }, 1);
        addItem({ id: "item_2", product: mockProduct2, store: mockStore1 }, 1);
        addItem({ id: "item_3", product: mockProduct3, store: mockStore2 }, 1);
    };

    if (itemCount === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg border border-neutral-100 min-h-[50vh]">
                <div className="bg-neutral-100 p-6 rounded-full mb-6">
                    <HugeiconsIcon icon={Delete02Icon} className="h-10 w-10 text-neutral-400" />
                </div>
                <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
                <p className="text-neutral-500 mb-8 max-w-sm text-center">
                    Looks like you haven&apos;t added anything to your cart yet.
                </p>
                <div className="flex flex-col gap-4">
                    <Link href="/">
                        <Button size="lg" className="rounded-full px-8">
                            Continue Shopping
                        </Button>
                    </Link>
                    <Button variant="outline" onClick={loadMockData} className="rounded-full">
                        Load Mock Data (Test)
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-2 mb-8">
                <Link href="/" className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                    <HugeiconsIcon icon={ArrowLeft01Icon} className="h-5 w-5" />
                </Link>
                <h1 className="text-2xl font-bold">Shopping Cart ({itemCount})</h1>
            </div>

            {Object.entries(itemsByStore).map(([storeId, storeItems]) => {
                const store = storeItems[0].store;
                // Calculate subtotal for this specific store
                const storeSubtotal = storeItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
                const currency = storeItems[0]?.product.currency || "KES";

                return (
                    <div key={storeId} className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm">

                        {/* Store Header */}
                        <div className="p-6 pb-4 flex items-center gap-4 border-b border-neutral-100">
                            <div className="h-10 w-10 rounded-full bg-neutral-900 flex items-center justify-center text-white font-bold text-sm">
                                {store.name.substring(0, 1)}
                            </div>
                            <div>
                                <h2 className="font-bold text-lg">{store.name}</h2>
                                <Link
                                    href={`/${store.slug}`}
                                    className="text-xs text-neutral-500 flex items-center gap-1 hover:text-blue-600"
                                >
                                    <HugeiconsIcon icon={ArrowLeft01Icon} className="h-3 w-3 rotate-180" />
                                    shop{store.slug.replace(/-/g, '')}.com
                                </Link>
                            </div>
                        </div>

                        {/* Items */}
                        <div className="divide-y divide-neutral-100">
                            {storeItems.map((item) => (
                                <div key={item.id} className="p-6 flex gap-6">
                                    <div className="relative h-32 w-32 bg-neutral-100 rounded-xl overflow-hidden shrink-0 border border-neutral-100">
                                        {item.product.image ? (
                                            <Image
                                                src={item.product.image}
                                                alt={item.product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-neutral-400 text-xs">
                                                No Image
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 flex flex-col justify-between py-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-base uppercase tracking-tight mb-1">
                                                    <Link href={`/${store.slug}/products/${item.product.slug}`} className="hover:underline">
                                                        {item.product.name}
                                                    </Link>
                                                </h3>
                                                <p className="text-neutral-500 text-sm">Off-white / XXS</p>
                                            </div>
                                            <div className="font-bold text-lg">
                                                {item.product.currency}{item.product.price.toFixed(2)}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-6">
                                            <div className="flex items-center border border-neutral-200 rounded-full bg-white h-10 shadow-sm">
                                                <button
                                                    onClick={() => {
                                                        if (item.quantity <= 1) {
                                                            removeItem(item.id);
                                                        } else {
                                                            updateQuantity(item.id, item.quantity - 1);
                                                        }
                                                    }}
                                                    className="w-10 h-full flex items-center justify-center hover:bg-neutral-50 rounded-l-full text-neutral-600"
                                                >
                                                    {item.quantity <= 1 ? <HugeiconsIcon icon={Delete02Icon} size={16} /> : <HugeiconsIcon icon={MinusSignIcon} size={16} />}
                                                </button>
                                                <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-10 h-full flex items-center justify-center hover:bg-neutral-50 rounded-r-full text-neutral-600"
                                                >
                                                    <HugeiconsIcon icon={PlusSignIcon} size={16} />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 text-neutral-400 hover:text-red-500 transition-colors"
                                            >
                                                <HugeiconsIcon icon={Delete02Icon} className="h-5 w-5" /> // Changed to more generic dots if available, or keep delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Store Footer */}
                        <div className="p-6 bg-white border-t border-neutral-100 flex items-center justify-between">
                            <div className="text-lg font-medium">Subtotal</div>
                            <div className="text-lg font-bold">{currency}{storeSubtotal.toFixed(2)}</div>
                        </div>

                        <div className="p-4 bg-neutral-50">
                            <Link href={`/checkout?storeId=${store.id}`}>
                                <Button className="w-full h-12 text-base font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20">
                                    Continue to checkout
                                </Button>
                            </Link>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
