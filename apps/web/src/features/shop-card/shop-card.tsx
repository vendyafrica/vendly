"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@vendly/ui/components/avatar";
import { Card, CardContent } from "@vendly/ui/components/card";
import { getShopUrl } from "@/lib/routing";

export type ShopCardShop = {
  id: string;
  name: string;
  slug: string;
  images: string[];
  pfp: string;
  rating: number;
  reviewCount?: number;
};

export type ShopCardProps = {
  shop: ShopCardShop;
};

export default function ShopCard({ shop }: ShopCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = useMemo(() => (shop.images.length ? shop.images : ["/"]), [shop.images]);

  const initials = useMemo(() => {
    const parts = shop.name.trim().split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? "";
    const second = parts.length > 1 ? parts[1]?.[0] ?? "" : parts[0]?.[1] ?? "";
    return (first + second).toUpperCase() || "?";
  }, [shop.name]);

  const handleDotClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handleClick = () => {
    window.location.href = getShopUrl(shop.slug);
  };

  return (
    <div
      className="relative w-full max-w-[250px] mx-auto group cursor-pointer"
      onClick={handleClick}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick();
      }}
    >
      <Card className="relative w-full aspect-square overflow-hidden rounded-[20px] border-0 bg-white py-0 shadow-sm transition-transform duration-300 group-hover:scale-[1.02]">
        <CardContent className="relative h-full w-full p-0">
          <img
            src={images[currentImageIndex]}
            alt={`${shop.name} image ${currentImageIndex + 1}`}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 grid place-items-center rounded-full bg-white/0 text-black/25 transition-colors hover:text-black/40 focus:outline-none"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 grid place-items-center rounded-full bg-white/0 text-black/25 transition-colors hover:text-black/40 focus:outline-none"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-[5px] z-10">
                {images.map((_, index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDotClick(index);
                    }}
                    className={`h-2 w-2 rounded-full transition-colors ${
                      index === currentImageIndex
                        ? "bg-white"
                        : "bg-transparent border border-gray-300"
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="mt-2 flex items-center justify-between px-[10px]">
        <div className="flex items-center gap-[10px] flex-1 min-w-0">
          <Avatar className="h-[30px] w-[30px] bg-white ring-1 ring-black/10">
            <AvatarImage src={shop.pfp} alt={`${shop.name} logo`} />
            <AvatarFallback className="bg-white text-[11px] font-medium text-black">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-sm text-black truncate">{shop.name}</span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 text-black">
          <span className="font-medium text-sm">{shop.rating.toFixed(1)}</span>
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        </div>
      </div>
    </div>
  );
}
