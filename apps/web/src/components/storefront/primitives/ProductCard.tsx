"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartProvider";
import { Star, Plus } from "lucide-react";

interface Product {
  id: string;
  name: string;
  title: string;
  price: number;
  priceAmount: number;
  description?: string;
  imageUrl?: string;
  category?: string;
  sizes?: string[];
  status?: string;
  rating?: number;
  originalPrice?: number;
}

interface ProductCardProps {
  product: Product;
  storeSlug: string;
  showAddToCart?: boolean;
}

export function ProductCard({ product, storeSlug, showAddToCart = true }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name || product.title,
      price: product.price || product.priceAmount,
      image: product.imageUrl || "/placeholder-product.jpg",
      size: product.sizes?.[0],
    });
  };

  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(2)}`;
  };

  const rating = product.rating ?? 4.5;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="group relative bg-white">
      {/* Product Image */}
      <Link href={`/${storeSlug}/product/${product.id}`} className="block relative aspect-[4/5] bg-gray-100 overflow-hidden mb-3">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name || product.title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <span className="text-sm">No image</span>
          </div>
        )}

        {/* Add Button - Circle Overlay */}
        {showAddToCart && (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-black hover:text-white transition-colors z-10"
            aria-label="Add to cart"
          >
            <Plus className="h-5 w-5" />
          </button>
        )}
      </Link>

      {/* Product Info */}
      <div className="space-y-1">
        {/* Title */}
        <Link href={`/${storeSlug}/product/${product.id}`}>
          <h3 className="text-base font-medium text-gray-900 line-clamp-1 group-hover:underline decoration-1 underline-offset-4">
            {product.name || product.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${i < fullStars
                  ? "fill-yellow-400 text-yellow-400"
                  : i === fullStars && hasHalfStar
                    ? "fill-yellow-400/50 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
                  }`}
              />
            ))}
          </div>
          {/* Optional: Show count if available */}
          {/* <span className="text-xs text-gray-400">(12)</span> */}
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <p className="text-base font-bold text-gray-900">
            {formatPrice(product.price || product.priceAmount)}
          </p>
          {/* Hide original price for cleaner look unless significantly different */}
          {product.originalPrice && product.originalPrice > (product.price || product.priceAmount) && (
            <p className="text-sm text-gray-400 line-through">
              {formatPrice(product.originalPrice)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
