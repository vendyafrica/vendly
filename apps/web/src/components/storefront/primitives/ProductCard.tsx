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
    <div className="group relative">
      {/* Product Image */}
      <Link href={`/${storeSlug}/product/${product.id}`} className="block relative aspect-[4/5] bg-[var(--muted,#f3f4f6)] overflow-hidden mb-3" style={{ borderRadius: "var(--radius)" }}>
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name || product.title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--muted-foreground)]">
            <span className="text-sm">No image</span>
          </div>
        )}

        {/* Add Button - Circle Overlay */}
        {showAddToCart && (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-colors z-10"
            style={{
              backgroundColor: "var(--background, #fff)",
              color: "var(--foreground, #000)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--primary)";
              e.currentTarget.style.color = "var(--primary-foreground)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--background, #fff)";
              e.currentTarget.style.color = "var(--foreground, #000)";
            }}
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
          <h3 className="text-base font-medium line-clamp-1 group-hover:underline decoration-1 underline-offset-4" style={{ color: "var(--foreground)", fontFamily: "var(--font-heading, inherit)" }}>
            {product.name || product.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex items-center text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${i < fullStars
                  ? "fill-current"
                  : "text-gray-300 dark:text-gray-600"
                  }`}
              />
            ))}
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <p className="text-base font-bold" style={{ color: "var(--foreground)" }}>
            {formatPrice(product.price || product.priceAmount)}
          </p>
          {product.originalPrice && product.originalPrice > (product.price || product.priceAmount) && (
            <p className="text-sm line-through" style={{ color: "var(--muted-foreground)" }}>
              {formatPrice(product.originalPrice)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
