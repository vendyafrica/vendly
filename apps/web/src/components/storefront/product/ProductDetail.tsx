"use client";

import { useStorefrontProducts } from "@/hooks/useStorefrontProducts";
import { useCart } from "@/components/storefront/CartProvider";
import { Button } from "@vendly/ui/components/button";
import { Star, Truck, Share2, Heart, Minus, Plus } from "lucide-react";
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
                <p className="text-gray-500">The product you are looking for does not exist.</p>
            </div>
        );
    }

    // Mock images: If we have one image but want to show variants, we basically duplicate it 4 times as requested
    // "use the same product in that part do 4 small mini cards"
    let images = product.imageUrl ? [product.imageUrl] : [];
    if (images.length === 1) {
        images = [images[0], images[0], images[0], images[0]];
    }
    // Fallback
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

    // Extract theme colors
    const theme = store?.theme as any;
    const themeConfig = theme?.themeConfig || theme || {};
    const colors = themeConfig.colors || {};

    // Dynamic styles based on theme
    const primaryColor = colors.primary || "#111111"; // Default black/dark
    const primaryForeground = colors.primaryForeground || "#ffffff";
    const secondaryColor = colors.secondary || "#f3f4f6";
    const secondaryForeground = colors.secondaryForeground || "#111111";

    return (
        <div className="bg-white min-h-screen">
            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">

                    {/* Left Column: Gallery */}
                    <div className="md:col-span-7 flex flex-col-reverse md:flex-row gap-4">
                        {/* Thumbnails */}
                        <div className="flex md:flex-col gap-4 overflow-auto md:w-24 shrink-0 hide-scrollbar">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(img)}
                                    className={`relative w-20 h-20 md:w-full md:h-24 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${currentImage === img ? "border-black" : "border-transparent hover:border-gray-200"
                                        }`}
                                    style={{ borderColor: currentImage === img ? primaryColor : undefined }}
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
                        <div className="flex-1 relative aspect-square bg-gray-50 rounded-2xl overflow-hidden">
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
                        <div className="flex items-center gap-3 pb-4 border-b">
                            <div
                                className="w-10 h-10 text-white rounded-full flex items-center justify-center font-bold text-sm"
                                style={{ backgroundColor: primaryColor, color: primaryForeground }}
                            >
                                {store?.name?.charAt(0) || "S"}
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">{store?.name || "Store Name"}</h3>
                                <div className="flex items-center text-xs text-yellow-500">
                                    <Star className="w-3 h-3 fill-current" />
                                    <span className="text-gray-600 ml-1">4.8 (1.2k)</span>
                                </div>
                            </div>
                        </div>

                        {/* Title & Price */}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${i < 4 ? "fill-current" : "text-gray-300"}`} />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-500 underline">148 ratings</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="text-2xl font-bold text-gray-900">{formatPrice(product.priceAmount)}</span>
                                {product.originalPrice && product.originalPrice > product.priceAmount && (
                                    <span className="text-lg text-gray-400 line-through font-medium">
                                        {new Intl.NumberFormat("en-US", { style: "currency", currency: product.currency || "KES" }).format(product.originalPrice / 100)}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Shipping */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm text-gray-900 font-medium">
                                <Truck className="w-4 h-4" />
                                <span>Shipping calculated at checkout</span>
                            </div>
                            <button className="text-[#6366F1] text-sm hover:underline">Add address</button>
                        </div>

                        {/* Quantity */}
                        <div className="space-y-3 pt-2">
                            <label className="text-sm font-semibold text-gray-900">Quantity</label>
                            <div className="flex items-center bg-white border border-gray-200 rounded-full w-32 h-10 shadow-sm">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
                                >
                                    <Minus className="w-3 h-3" />
                                </button>
                                <span className="flex-1 text-center font-medium text-gray-900">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
                                >
                                    <Plus className="w-3 h-3" />
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3 pt-4">
                            <Button
                                size="lg"
                                className="w-full rounded-full h-12 text-base transition-opacity hover:opacity-90"
                                style={{
                                    backgroundColor: primaryColor,
                                    color: primaryForeground
                                }}
                                onClick={handleAddToCart}
                            >
                                Add to cart
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="w-full rounded-full h-12 text-base border-2"
                                style={{
                                    borderColor: primaryColor,
                                    color: primaryColor,
                                    backgroundColor: 'transparent'
                                }}
                            >
                                Buy now
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Button variant="outline" className="rounded-full flex gap-2">
                                <Heart className="w-4 h-4" /> Save
                            </Button>
                            <Button variant="outline" className="rounded-full flex gap-2">
                                <Share2 className="w-4 h-4" /> Share
                            </Button>
                        </div>

                        {/* Description */}
                        <div className="pt-6 border-t space-y-3">
                            <h3 className="font-semibold">Description</h3>
                            <div className="text-gray-600 leading-relaxed text-sm">
                                {product.description || "No description available for this product."}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
