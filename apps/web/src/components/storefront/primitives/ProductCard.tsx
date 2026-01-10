"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "../CartProvider";
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

export function ProductCard({ product, storeSlug, showAddToCart = false }: ProductCardProps) {
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
      <Link href={`/${storeSlug}/product/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name || product.title}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-sm">No image</span>
            </div>
          )}
          
          {/* Status Badge */}
          {product.status === "new" && (
            <span className="absolute top-3 left-3 bg-gray-900 text-white px-3 py-1 text-xs font-medium tracking-wide uppercase">
              New
            </span>
          )}

          {/* Quick Add Button - Shows on Hover */}
          {showAddToCart && (
            <button
              onClick={handleAddToCart}
              className="absolute bottom-3 right-3 w-10 h-10 bg-white text-gray-900 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-gray-100"
              aria-label="Add to cart"
            >
              <Plus className="h-5 w-5" />
            </button>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="pt-4 pb-2">
        {/* Brand/Category */}
        {product.category && (
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
            {product.category}
          </p>
        )}
        
        {/* Product Name */}
        <Link href={`/${storeSlug}/product/${product.id}`}>
          <h3 className="text-sm font-medium text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2 mb-2">
            {product.name || product.title}
          </h3>
        </Link>

        {/* Rating Stars */}
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${
                i < fullStars
                  ? "fill-yellow-400 text-yellow-400"
                  : i === fullStars && hasHalfStar
                  ? "fill-yellow-400/50 text-yellow-400"
                  : "fill-gray-200 text-gray-200"
              }`}
            />
          ))}
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-gray-900">
            {formatPrice(product.price || product.priceAmount)}
          </p>
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
