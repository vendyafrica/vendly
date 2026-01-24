"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@vendly/ui/components/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    StarIcon,
    FavouriteIcon,
    MinusSignIcon,
    PlusSignIcon,
    Loading03Icon,
    Tick02Icon,
} from "@hugeicons/core-free-icons";
import { Avatar, AvatarImage, AvatarFallback } from "@vendly/ui/components/avatar";
import { useCart } from "../../../contexts/cart-context";

interface ProductDetailsProps {
    slug: string;
}

interface Product {
    id: string;
    slug: string;
    name: string;
    description?: string | null;
    price: number;
    currency: string;
    images: string[];
    rating: number;
    store: {
        id: string;
        name: string;
        slug: string;
    };
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function ProductDetails({ slug }: ProductDetailsProps) {
    const params = useParams();
    const router = useRouter();
    const storeSlug = params?.storefront as string;
    const { addItem } = useCart();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isAdded, setIsAdded] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!storeSlug || !slug) {
                setLoading(false);
                setError("Invalid product or store");
                return;
            }

            try {
                const res = await fetch(`${API_BASE}/api/storefront/${storeSlug}/products/${slug}`);
                if (!res.ok) {
                    if (res.status === 404) {
                        setError("Product not found");
                    } else {
                        setError("Failed to load product");
                    }
                    setProduct(null);
                } else {
                    const data = await res.json();
                    setProduct(data);
                    setError(null);
                }
            } catch (err) {
                console.error("Failed to fetch product:", err);
                setError("Failed to load product");
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [storeSlug, slug]);

    const handleQuantityChange = (delta: number) => {
        setQuantity(prev => Math.max(1, prev + delta));
    };

    const handleAddToCart = () => {
        if (!product) return;

        addItem({
            id: product.id,
            product: {
                id: product.id,
                name: product.name,
                price: product.price,
                currency: product.currency,
                image: product.images[0],
                slug: product.slug,
            },
            store: {
                id: product.store.id,
                name: product.store.name,
                slug: product.store.slug,
            },
        }, quantity);

        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    const handleBuyNow = () => {
        if (!product) return;
        handleAddToCart();
        router.push(`/checkout?storeId=${product.store.id}`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <HugeiconsIcon icon={Loading03Icon} size={32} className="animate-spin text-neutral-400" />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-medium">{error || "Product not found"}</h2>
            </div>
        );
    }

    const images = product.images.length > 0 ? product.images : ["/images/placeholder-product.png"];
    const currentImage = images[selectedImageIndex] || images[0];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 min-h-screen px-3 sm:px-4 md:px-8 bg-white">

            {/* Mobile horizontal gallery */}
            <div className="lg:hidden w-full">
                <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
                    {images.map((img, i) => (
                        <div key={i} className="relative shrink-0 w-64 aspect-4/5 bg-[#F0F0F0] rounded-xl overflow-hidden">
                            <Image
                                src={img}
                                alt={`${product.name} view ${i + 1}`}
                                fill
                                sizes="256px"
                                className="object-cover mix-blend-multiply"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Desktop sticky gallery */}
            <div className="hidden lg:flex lg:col-span-7 flex-col-reverse md:flex-row gap-4 lg:h-screen lg:sticky lg:top-0 lg:py-8 lg:overflow-hidden">
                <div className="flex md:flex-col gap-3 md:max-h-full w-full md:w-20 lg:w-24 shrink-0 overflow-hidden">
                    {images.map((img, i) => (
                        <div
                            key={i}
                            onClick={() => setSelectedImageIndex(i)}
                            className={`relative shrink-0 w-20 md:w-full aspect-square bg-[#F0F0F0] rounded-lg overflow-hidden cursor-pointer transition-all ${selectedImageIndex === i ? "ring-2 ring-black" : "hover:ring-2 ring-black/50"
                                }`}
                        >
                            <Image
                                src={img}
                                alt={`${product.name} view ${i + 1}`}
                                fill
                                sizes="100px"
                                className="object-cover mix-blend-multiply"
                            />
                        </div>
                    ))}
                </div>

                {/* Main Product Image */}
                <div className="flex-1 relative overflow-hidden bg-[#F0F0F0] rounded-2xl aspect-4/5 flex items-center justify-center group">
                    <Image
                        src={currentImage}
                        alt={product.name}
                        width={800}
                        height={1000}
                        className="object-cover w-full h-full mix-blend-multiply"
                        priority
                    />

                    <div className="absolute top-4 right-4 z-10">
                        <span className="inline-block rounded-sm bg-neutral-300/50 text-neutral-900/80 backdrop-blur-sm px-4 py-2 text-sm font-semibold">
                            {product.currency} {product.price.toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>

            {/* Details column */}
            <div className="lg:col-span-5 h-full lg:h-screen overflow-visible lg:overflow-y-auto pr-0 lg:pr-1">
                <div className="space-y-8 py-3 md:py-4">

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-black/5 w-fit">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={`/images/store-avatar.png`} />
                                    <AvatarFallback>{product.store.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <span className="text-xs font-semibold tracking-wide uppercase text-neutral-600">{product.store.name}</span>
                            </div>

                            <div className="flex items-center gap-1">
                                <Button size="icon" variant="ghost" className="rounded-full h-10 w-10 hover:bg-neutral-100">
                                    <HugeiconsIcon icon={FavouriteIcon} size={24} />
                                </Button>
                            </div>
                        </div>

                        <h1 className="text-xl md:text-xl font-medium tracking-tight text-neutral-900 leading-[1.1]">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-4">
                            <span className="text-lg font-medium text-neutral-700">{product.currency} {product.price.toLocaleString()}</span>
                            <div className="flex items-center gap-1.5">
                                <HugeiconsIcon icon={StarIcon} size={16} className="text-black fill-black" />
                                <span className="font-medium text-sm">{product.rating.toFixed(1)}</span>
                            </div>
                        </div>

                        {product.description && (
                            <p className="text-sm text-neutral-500 leading-relaxed">
                                {product.description}
                            </p>
                        )}
                    </div>

                    <div className="w-full h-px bg-neutral-200" />

                    <div className="space-y-4 pt-4">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center border border-neutral-300 rounded-full px-2 py-1">
                                <button
                                    onClick={() => handleQuantityChange(-1)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors"
                                >
                                    <HugeiconsIcon icon={MinusSignIcon} size={16} />
                                </button>
                                <div className="w-10 text-center font-medium text-sm">
                                    {quantity}
                                </div>
                                <button
                                    onClick={() => handleQuantityChange(1)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors"
                                >
                                    <HugeiconsIcon icon={PlusSignIcon} size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            <Button
                                onClick={handleAddToCart}
                                className="w-full rounded-full h-14 text-lg font-medium shadow-xl shadow-neutral-200 hover:shadow-neutral-300 transition-shadow"
                            >
                                {isAdded ? (
                                    <>
                                        <HugeiconsIcon icon={Tick02Icon} className="mr-2 h-5 w-5" />
                                        Added to Cart
                                    </>
                                ) : (
                                    "Add to Cart"
                                )}
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full rounded-full h-14 text-base font-medium border-neutral-300 hover:bg-neutral-50"
                                onClick={handleBuyNow}
                            >
                                Buy Now
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}