"use client";

import * as React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
  CarouselPrevious,
  CarouselNext,
} from "@vendly/ui/components/carousel";
import { cn } from "@vendly/ui/lib/utils";

interface StoreCarouselProps {
  images: string[];
  className?: string;
}

export function StoreCarousel({ images, className }: StoreCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);

  const stopEvent = (e: React.SyntheticEvent) => {
    e.stopPropagation();
  };

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div
      className={cn("relative group", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Carousel
        setApi={setApi}
        className="w-full h-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="ml-0">
          {images.map((image, index) => (
            <CarouselItem key={index} className="pl-0">
              <div className="relative aspect-2/3 overflow-hidden">
                <Image
                  src={image}
                  alt={`Product ${index + 1}`}
                  fill
                  className="object-cover"
                  draggable={false}
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation arrows - visible on hover */}
        {images.length > 1 && (
          <>
            <CarouselPrevious
              className={cn(
                "absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white border-0 shadow-md transition-opacity duration-200 z-10",
                isHovered ? "opacity-100" : "opacity-0"
              )}
              onPointerDownCapture={stopEvent}
              onClickCapture={stopEvent}
            />
            <CarouselNext
              className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white border-0 shadow-md transition-opacity duration-200 z-10",
                isHovered ? "opacity-100" : "opacity-0"
              )}
              onPointerDownCapture={stopEvent}
              onClickCapture={stopEvent}
            />
          </>
        )}
      </Carousel>

      {/* Dot indicators - always visible */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1.5">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              onPointerDownCapture={stopEvent}
              onClickCapture={stopEvent}
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-all",
                current === index + 1
                  ? "bg-white w-6"
                  : "bg-white/60 hover:bg-white/80"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
