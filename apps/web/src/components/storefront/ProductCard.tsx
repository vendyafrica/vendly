"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartProvider";
import { Plus } from "lucide-react";

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
}

interface ProductCardProps {
  product: Product;
  storeSlug: string;
  showAddToCart?: boolean;
}

export function ProductCard({ product, storeSlug, showAddToCart = true }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name || product.title,
      price: product.price || product.priceAmount,
      image: product.imageUrl || "/placeholder-product.jpg",
      size: product.sizes?.[0], // Add first size if available
    });
  };

  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(2)}`;
  };

  return (
    <div className="group relative bg-background border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      {/* Product Image */}
      <Link href={`/${storeSlug}/product/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name || product.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
          
          {/* Optional: Badge for status */}
          {product.status === "new" && (
            <span className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 text-xs font-medium rounded">
              New
            </span>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <Link href={`/${storeSlug}/product/${product.id}`}>
          <h3 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {product.name || product.title}
          </h3>
        </Link>

        {/* Price */}
        <p className="text-lg font-semibold text-foreground mt-2">
          {formatPrice(product.price || product.priceAmount)}
        </p>

        {/* Sizes (if fashion) */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="mt-2">
            <p className="text-xs text-muted-foreground mb-1">Sizes:</p>
            <div className="flex gap-1">
              {product.sizes.slice(0, 4).map((size) => (
                <span
                  key={size}
                  className="text-xs px-2 py-1 bg-muted rounded"
                >
                  {size}
                </span>
              ))}
              {product.sizes.length > 4 && (
                <span className="text-xs px-2 py-1 bg-muted rounded">
                  +{product.sizes.length - 4}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Add to Cart Button */}
        {showAddToCart && (
          <button
            onClick={handleAddToCart}
            className="mt-3 w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}
