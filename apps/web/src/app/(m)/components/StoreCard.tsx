"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MarketplaceStore } from "@/types/marketplace";
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
        className="block rounded-3xl overflow-hidden bg-card text-card-foreground shadow-sm hover:shadow-2xl transition-all duration-300 active:scale-[0.98] cursor-pointer"
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
        <div className="aspect-4/3 relative overflow-hidden">
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
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselNavigation
                className="opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                classNameButton="bg-background/90 hover:bg-background shadow-sm pointer-events-auto"
              />
              <CarouselIndicator className="pb-4" />
            </Carousel>
          ) : (
            <div className="flex h-full items-center justify-center bg-muted text-muted-foreground">
              No images yet
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 px-1">
        <div className="flex items-center gap-2">
          <div className="relative w-6 h-6 rounded-full overflow-hidden bg-muted">
            {store.instagramAvatarUrl || store.logoUrl ? (
              <Image
                src={(store.instagramAvatarUrl || store.logoUrl)!}
                alt={`${store.name} logo`}
                fill
                sizes="24px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[10px] font-semibold text-muted-foreground">
                {store.name?.slice(0, 1) || "S"}
              </div>
            )}
          </div>
          <Link
            href={`/${store.slug}`}
            className="font-bold text-sm text-foreground leading-tight hover:text-foreground/80 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {store.name}
          </Link>
        </div>
      </div>
    </div>
  );
}
