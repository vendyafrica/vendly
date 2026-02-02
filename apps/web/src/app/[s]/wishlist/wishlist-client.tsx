"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Button } from "@vendly/ui/components/button";
import { useWishlist } from "@/hooks/use-wishlist";

export default function WishlistClient() {
    const params = useParams();
    const storeSlug = params?.s as string;
    const { items, removeFromWishlist } = useWishlist();

    if (items.length === 0) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
                <h1 className="text-xl font-semibold text-neutral-900">Wishlist</h1>
                <p className="mt-2 text-sm text-neutral-600">You haven’t saved anything yet.</p>
                <div className="mt-6">
                    <Link href={`/${storeSlug}`}>
                        <Button>Continue shopping</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
            <div className="flex items-end justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold text-neutral-900">Wishlist</h1>
                    <p className="mt-1 text-sm text-neutral-600">Saved items</p>
                </div>
                <Link href={`/${storeSlug}`} className="text-sm text-neutral-700 hover:text-neutral-900">
                    Continue shopping
                </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item) => {
                    const href = item.slug ? `/${storeSlug}/products/${item.slug}` : `/${storeSlug}`;
                    return (
                        <div key={item.id} className="rounded-xl border border-neutral-200 overflow-hidden bg-white">
                            <Link href={href} className="block">
                                <div className="relative aspect-4/5 bg-neutral-50">
                                    <Image
                                        src={item.image || "/images/placeholder-product.png"}
                                        alt={item.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        className="object-cover"
                                    />
                                </div>
                            </Link>
                            <div className="p-4">
                                <div className="text-sm font-medium text-neutral-900 line-clamp-2">{item.name}</div>
                                <div className="mt-1 text-sm text-neutral-700">{item.currency} {item.price.toLocaleString()}</div>
                                <div className="mt-4 flex items-center gap-2">
                                    <Link href={href} className="flex-1">
                                        <Button className="w-full" variant="outline">View</Button>
                                    </Link>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => removeFromWishlist(item.id)}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
