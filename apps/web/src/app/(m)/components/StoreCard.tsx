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
      <Link
        href={`/${store.slug}`}
        className="block bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 active:scale-[0.98]"
      >
        <div className="aspect-square relative">
          <StoreCarousel images={store.images ?? []} className="w-full h-full" />
        </div>
      </Link>

      <div className="flex items-center justify-between mt-4 px-1">
        <div className="flex items-center gap-2">
          <div className="relative w-6 h-6 rounded-full overflow-hidden bg-gray-100">
            {store.logoUrl ? (
              <Image
                src={store.logoUrl}
                alt={`${store.name} logo`}
                fill
                sizes="24px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[10px] font-semibold text-gray-500">
                {store.name?.slice(0, 1) || "S"}
              </div>
            )}
          </div>
          <Link
            href={`/${store.slug}`}
            className="font-bold text-sm text-gray-900 leading-tight hover:text-black transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {store.name}
          </Link>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <span className="text-sm font-bold text-black">{store.rating}</span>
          <Star className="w-3.5 h-3.5 fill-black text-black" />
        </div>
      </div>
    </div>
  );
}
