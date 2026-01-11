"use client";

import { useStorefrontProducts } from "@/hooks/useStorefrontProducts";
import { useCart } from "@/components/storefront/primitives/CartProvider";
import { Button } from "@vendly/ui/components/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ContainerTruck01Icon ,StarIcon,SentIcon,FavouriteIcon,MinusSignIcon,PlusSignIcon } from "@hugeicons/core-free-icons";
import Image from "next/image";
import { useState } from "react";
import { useStorefrontStore } from "@/hooks/useStorefrontStore";

interface ProductDetailProps {
    storeSlug: string;
    productId: string;
}

export function ProductDetail({ storeSlug, productId }: ProductDetailProps) {
    const { products, isLoading } = useStorefrontProducts(storeSlug);
    const { store } = useStorefrontStore(storeSlug);
    const { addItem } = useCart();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);

    const product = products.find((p) => p.id === productId);

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 animate-pulse">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gray-200 aspect-square rounded-xl"></div>
                    <div className="space-y-4">
                        <div className="h-8 bg-gray-200 w-3/4 rounded"></div>
                        <div className="h-4 bg-gray-200 w-1/4 rounded"></div>
                        <div className="h-20 bg-gray-200 w-full rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h1 className="text-2xl font-bold">Product not found</h1>
                <p className="text-muted-foreground">The product you are looking for does not exist.</p>
            </div>
        );
    }

    let images = product.imageUrl ? [product.imageUrl] : [];
    if (images.length === 1) {
        images = [images[0], images[0], images[0], images[0]];
    }
    if (images.length === 0) images = ["/placeholder-product.jpg", "/placeholder-product.jpg", "/placeholder-product.jpg", "/placeholder-product.jpg"];

    const currentImage = selectedImage || images[0];

    const handleAddToCart = () => {
        addItem({
            id: product.id,
            name: product.title,
            price: product.priceAmount,
            image: product.imageUrl || "/placeholder-product.jpg",
            quantity: quantity,
        });
    };

    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: product.currency || "KES",
        }).format(amount / 100);
    };

    return (
        <div className="bg-[var(--background)] min-h-screen text-[var(--foreground)]">
            <div className="mx-auto px-4 py-8 md:py-12 max-w-[var(--container-max)]">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">

                    {/* Left Column: Gallery */}
                    <div className="md:col-span-7 flex flex-col-reverse md:flex-row gap-4">
                        {/* Thumbnails */}
                        <div className="flex md:flex-col gap-4 overflow-auto md:w-24 shrink-0 hide-scrollbar">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(img)}
                                    className={`relative w-20 h-20 md:w-full md:h-24 overflow-hidden border-2 transition-all shrink-0 ${currentImage === img ? "border-[var(--primary)]" : "border-transparent hover:border-[var(--border)]"
                                        }`}
                                    style={{
                                        borderRadius: "var(--radius)",
                                    }}
                                >
                                    <Image
                                        src={img}
                                        alt={`Thumbnail ${idx}`}
                                        fill
                                        className="object-cover"
                                    />
                                </button>
                            ))}
                        </div>

                        {/* Main Image */}
                        <div
                            className="flex-1 relative aspect-square bg-[var(--muted)] overflow-hidden"
                            style={{ borderRadius: "var(--radius)" }}
                        >
                            <Image
                                src={currentImage}
                                alt={product.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>

                    {/* Right Column: Details */}
                    <div className="md:col-span-5 space-y-6">

                        {/* Store Info */}
                        <div className="flex items-center gap-3 pb-4 border-b border-[var(--border)]">
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-[var(--primary)] text-[var(--primary-foreground)]"
                            >
                                {store?.name?.charAt(0) || "S"}
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">{store?.name || "Store Name"}</h3>
                                <div className="flex items-center text-xs text-yellow-500">
                                    <HugeiconsIcon icon={StarIcon} className="w-3 h-3 fill-current" />
                                    <span className="text-[var(--muted-foreground)] ml-1">4.8 (1.2k)</span>
                                </div>
                            </div>
                        </div>

                        {/* Title & Price */}
                        <div>
                            <h1 className="text-3xl font-bold mb-2 font-[family-name:var(--font-heading)]">{product.title}</h1>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <HugeiconsIcon icon={StarIcon} key={i} className={`w-4 h-4 ${i < 4 ? "fill-current" : "text-gray-300"}`} />
                                    ))}
                                </div>
                                <span className="text-sm text-[var(--muted-foreground)] underline">148 ratings</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="text-2xl font-bold">{formatPrice(product.priceAmount)}</span>
                                {product.originalPrice && product.originalPrice > product.priceAmount && (
                                    <span className="text-lg text-[var(--muted-foreground)] line-through font-medium">
                                        {new Intl.NumberFormat("en-US", { style: "currency", currency: product.currency || "KES" }).format(product.originalPrice / 100)}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Shipping */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <HugeiconsIcon icon={ContainerTruck01Icon} className="w-4 h-4" />
                                <span>Shipping calculated at checkout</span>
                            </div>
                        </div>

                        {/* Quantity */}
                        <div className="space-y-3 pt-2">
                            <label className="text-sm font-semibold">Quantity</label>
                            <div className="flex items-center border border-[var(--input)] rounded-[var(--radius)] w-32 h-10 shadow-sm">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-10 h-full flex items-center justify-center hover:bg-[var(--muted)] transition-colors"
                                >
                                    <HugeiconsIcon icon={MinusSignIcon} className="w-3 h-3" />
                                </button>
                                <span className="flex-1 text-center font-medium">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-10 h-full flex items-center justify-center hover:bg-[var(--muted)] transition-colors"
                                >
                                    <HugeiconsIcon icon={PlusSignIcon} className="w-3 h-3" />
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3 pt-4">
                            <Button
                                size="lg"
                                className="w-full h-12 text-base rounded-[var(--radius)]"
                                onClick={handleAddToCart}
                            >
                                Add to cart
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="w-full h-12 text-base rounded-[var(--radius)]"
                            >
                                Buy now
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Button variant="outline" className="rounded-[var(--radius)] flex gap-2">
                                <HugeiconsIcon icon={FavouriteIcon} className="w-4 h-4" /> Save
                            </Button>
                            <Button variant="outline" className="rounded-[var(--radius)] flex gap-2">
                                <HugeiconsIcon icon={SentIcon} className="w-4 h-4" /> Share
                            </Button>
                        </div>

                        {/* Description */}
                        <div className="pt-6 border-t border-[var(--border)] space-y-3">
                            <h3 className="font-semibold">Description</h3>
                            <div className="text-[var(--muted-foreground)] leading-relaxed text-sm">
                                {product.description || "No description available for this product."}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
