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
import { StoreAvatarSimple } from "@/components/store-avatar";
import { HugeiconsIcon } from "@hugeicons/react";
import { StarIcon } from "@hugeicons/core-free-icons";
import { Bricolage_Grotesque } from "next/font/google";

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage-grotesque",
  subsets: ["latin"],
});

interface StoreCardProps {
  store: MarketplaceStore;
}

const FALLBACK_STORE_IMAGE = "https://cdn.cosmos.so/64986e58-da40-41e5-b0e2-1d041230c287?format=jpeg";

// Helper function to capitalize only the first letter
const capitalizeFirstLetter = (str: string) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export function StoreCard({ store }: StoreCardProps) {
  const router = useRouter();
  const carouselImages = store.images && store.images.length > 0 ? store.images : [FALLBACK_STORE_IMAGE];

  // Mock rating - you can replace this with actual rating from store data
  const rating = 4.8;

  return (
    <div className="group">
      <div
        role="link"
        tabIndex={0}
        className="block rounded-2xl overflow-hidden bg-card text-card-foreground shadow-sm hover:shadow-lg transition-all duration-300 active:scale-[0.98] cursor-pointer"
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
            <Carousel className="h-full">
              <CarouselContent className="h-full">
                {carouselImages.map((src, idx) => (
                  <CarouselItem key={`${src}-${idx}`} className="h-full">
                    <div className="relative h-full w-full">
                      <Image
                        src={src}
                        alt={`${store.name} hero ${idx + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 33vw"
                        priority={idx === 0}
                        unoptimized={src.includes("blob.vercel-storage.com")}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselNavigation
                className="opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                classNameButton="bg-background/90 hover:bg-background shadow-sm pointer-events-auto"
              />
              <CarouselIndicator className="pb-3" />
            </Carousel>
          ) : (
            <div className="flex h-full items-center justify-center bg-muted text-muted-foreground">
              No images yet
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 px-0.5">
        <div className="flex items-center gap-2.5">
          <StoreAvatarSimple
            storeName={store.name}
            logoUrl={store.logoUrl}
            instagramAvatarUrl={store.instagramAvatarUrl}
            size={32}
          />
          <Link
            href={`/${store.slug}`}
            className={`${bricolageGrotesque.className} text-base font-normal text-foreground leading-tight hover:text-foreground/80 transition-colors`}
            onClick={(e) => e.stopPropagation()}
          >
            {capitalizeFirstLetter(store.name)}
          </Link>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-sm font-medium text-foreground">{rating}</span>
          <HugeiconsIcon icon={StarIcon} size={16} className="text-foreground fill-foreground" />
        </div>
      </div>
    </div>
  );
}
