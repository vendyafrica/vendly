"use client";

import { useState } from "react";
import { Button } from "@vendly/ui/components/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  MinusSignIcon,
  PlusSignIcon,
  Tick02Icon,
  FavouriteIcon,
} from "@hugeicons/core-free-icons";
import { useCart } from "../../../contexts/cart-context";
import { useWishlist } from "@/hooks/use-wishlist";

interface ProductActionsProduct {
  id: string;
  name: string;
  price: number;
  currency: string;
  images: string[];
  mediaItems?: { url: string; contentType?: string | null }[];
  slug: string;
  store: {
    id: string;
    name: string;
    slug: string;
    logoUrl?: string | null;
  };
}

interface ProductActionsProps {
  product: ProductActionsProduct;
}

export function ProductActions({ product }: ProductActionsProps) {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const handleToggleWishlist = () => {
    toggleWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      currency: product.currency,
      image: product.images?.[0],
      contentType: product.mediaItems?.[0]?.contentType || undefined,
      store: {
        id: product.store.id,
        name: product.store.name,
        slug: product.store.slug,
      },
    });
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleAddToCart = () => {
    if (!product) return;

    addItem(
      {
        id: product.id,
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          currency: product.currency,
          image: product.images[0],
          contentType: product.mediaItems?.[0]?.contentType || undefined,
          slug: product.slug,
        },
        store: {
          id: product.store.id,
          name: product.store.name,
          slug: product.store.slug,
          logoUrl: product.store.logoUrl,
        },
      },
      quantity,
    );

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const wishlisted = isInWishlist(product.id);

  return (
    <div className="max-w-sm mt-1">
      {/* Quantity */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-5 mb-5">
        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Quantity</span>
        <div className="flex items-center gap-5">
          <button
            onClick={() => handleQuantityChange(-1)}
            className="p-1.5 hover:bg-neutral-100 rounded-md text-neutral-600 hover:text-neutral-900 transition-all"
          >
            <HugeiconsIcon icon={MinusSignIcon} size={18} />
          </button>
          <span className="text-base font-semibold w-6 text-center tabular-nums">{quantity}</span>
          <button
            onClick={() => handleQuantityChange(1)}
            className="p-1.5 hover:bg-neutral-100 rounded-md text-neutral-600 hover:text-neutral-900 transition-all"
          >
            <HugeiconsIcon icon={PlusSignIcon} size={18} />
          </button>
        </div>
      </div>

      {/* Buttons */}
      <div className="grid gap-3 pt-4">
        <Button
          onClick={handleAddToCart}
          className="w-full h-12 rounded-md bg-primary text-white hover:bg-primary/80 uppercase text-xs tracking-wider cursor"
          disabled={isAdded}
        >
          {isAdded ? (
            <span className="flex items-center gap-2">
              <HugeiconsIcon icon={Tick02Icon} size={16} />
              Added to Bag
            </span>
          ) : (
            "Add to Bag"
          )}
        </Button>
        <Button
          onClick={handleToggleWishlist}
          variant="outline"
          className={`h-12 rounded-md border text-sm font-medium transition-all flex items-center justify-center gap-2 ${
            wishlisted
              ? "border-neutral-900 text-neutral-900 bg-neutral-50"
              : "border-neutral-200 text-neutral-800 hover:border-neutral-900 hover:text-neutral-900"
          }`}
          aria-pressed={wishlisted}
        >
          <HugeiconsIcon
            icon={FavouriteIcon}
            size={18}
            className={wishlisted ? "text-neutral-900" : "text-neutral-600"}
          />
          {wishlisted ? "Saved to Wishlist" : "Save to Wishlist"}
        </Button>
      </div>
    </div>
  );
}
