"use client";

import Link from "next/link";
import Image from "next/image";
import type { MarketplaceStore } from "@/types/marketplace";
import { StoreCarousel } from "./StoreCarousel";
import { Star } from "lucide-react";

interface StoreCardProps {
  store: MarketplaceStore;
}

export function StoreCard({ store }: StoreCardProps) {
  return (
    <div className="group">
      {/* Image Card - Full rounded */}
      <Link
        href={`/store/${store.slug}`}
        className="block bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 active:scale-[0.98]"
      >
        <div className="aspect-square relative">
          <StoreCarousel images={store.images} className="w-full h-full" />
        </div>
      </Link>

      {/* Store Info - Below the card */}
      <div className="flex items-center justify-between mt-3 px-1">
        {/* Profile Picture and Store Name */}
        <div className="flex items-center gap-2">
          <div className="relative w-6 h-6 rounded-full overflow-hidden bg-gray-100">
            <Image
              src={store.logoUrl}
              alt={`${store.name} logo`}
              fill
              className="object-cover"
            />
          </div>
          <Link
            href={`/store/${store.slug}`}
            className="font-semibold text-sm text-gray-900 leading-tight hover:text-black transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {store.name}
          </Link>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium text-gray-700">{store.rating}</span>
          <Star className="w-3.5 h-3.5 fill-gray-400 text-gray-400" />
        </div>
      </div>
    </div>
  );
}
