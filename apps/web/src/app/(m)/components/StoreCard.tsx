"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MarketplaceStore } from "@/types/marketplace";
import { Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselIndicator,
  CarouselItem,
  CarouselNavigation,
} from "@vendly/ui/components/carousel";

interface StoreCardProps {
  store: MarketplaceStore;
}

export function StoreCard({ store }: StoreCardProps) {
  const router = useRouter();
  const carouselImages = store.images ?? [];

  return (
    <div className="group">
      <div
        role="link"
        tabIndex={0}
        className="block bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 active:scale-[0.98] cursor-pointer"
        onClick={() => {
          router.push(`/${store.slug}`);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            router.push(`/${store.slug}`);
          }
        }}
      >
        <div className="aspect-square relative overflow-hidden">
          {carouselImages.length > 0 ? (
            <Carousel className="h-full" disableDrag={true}>
              <CarouselContent className="h-full">
                {carouselImages.map((src, idx) => (
                  <CarouselItem key={`${src}-${idx}`} className="h-full">
                    <div className="relative h-full w-full">
                      <Image
                        src={src}
                        alt={`${store.name} hero ${idx + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority={idx === 0}
                        unoptimized
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselNavigation
                className="opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                classNameButton="bg-white/90 hover:bg-white shadow-sm pointer-events-auto"
              />
              <CarouselIndicator className="pb-4" />
            </Carousel>
          ) : (
            <div className="flex h-full items-center justify-center bg-zinc-50 text-zinc-400">
              No images yet
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 px-1">
        <div className="flex items-center gap-2">
          <div className="relative w-6 h-6 rounded-full overflow-hidden bg-gray-100">
            {store.instagramAvatarUrl || store.logoUrl ? (
              <Image
                src={(store.instagramAvatarUrl || store.logoUrl)!}
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
