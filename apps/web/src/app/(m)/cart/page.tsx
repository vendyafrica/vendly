"use client";

import Link from "next/link";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon, MinusSignIcon, PlusSignIcon, ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@vendly/ui/components/button";
import { useCart } from "../../../contexts/cart-context";
import { Avatar, AvatarFallback, AvatarImage } from "@vendly/ui/components/avatar";

export default function CartPage() {
    const { items, itemsByStore, updateQuantity, removeItem, cartTotal, itemCount, addItem } = useCart();

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
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-3">
            <div className="flex items-center gap-1 mb-4">
                <Link href="/" className="p-1 hover:bg-neutral-100 rounded-full transition-colors">
                    <HugeiconsIcon icon={ArrowLeft01Icon} className="h-5 w-5" />
                </Link>
                <h1 className="text-xl font-semibold">Shopping Bag</h1>
            </div>

            {Object.entries(itemsByStore).map(([storeId, storeItems]) => {
                const store = storeItems[0].store;
                const storeSubtotal = storeItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
                const currency = storeItems[0]?.product.currency || "KES";

                return (
                    <div key={storeId} className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm">
                        <div className="p-6 pb-3 flex items-center gap-4">
                            <Avatar>
                                <AvatarImage
                                    src="https://github.com/shadcn.png"
                                    alt="@shadcn"
                                    className="grayscale"
                                />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div>
                                <Link href={`/${store.slug}`}>
                                    <h2 className="font-semibold text-md hover:text-primary/80 transition-colors hover:underline">{store.name}</h2>
                                </Link>
                            </div>
                        </div>

                        <div className="divide-y divide-neutral-100">
                            {storeItems.map((item) => (
                                <div key={item.id} className="p-6 flex gap-6">
                                    <div className="relative h-20 w-20 bg-neutral-100 rounded-lg overflow-hidden shrink-0 border border-neutral-100">
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
                                                <h3 className="font-semibold text-base uppercase tracking-tight mb-1">
                                                    <Link href={`/${store.slug}/products/${item.product.slug}`}>
                                                        {item.product.name}
                                                    </Link>
                                                </h3>
                                            </div>
                                            <div className="font-medium text-md">
                                                {item.product.currency} {item.product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                                                <HugeiconsIcon icon={Delete02Icon} className="h-4 w-4 cursor-pointer" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Store Footer */}
                        <div className="p-6 bg-white border-t border-neutral-100 flex items-center justify-between">
                            <div className="text-lg font-medium">Subtotal</div>
                            <div className="text-lg font-semibold">{currency} {storeSubtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        </div>

                        <div className="p-4">
                            <Link href={`/checkout?storeId=${store.id}`}>
                                <Button className="w-full h-12 text-base font-semibold rounded-4xl shadow-md shadow-indigo-600/20">
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
