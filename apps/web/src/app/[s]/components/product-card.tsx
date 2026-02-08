"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

interface ProductCardProps {
  title: string;
  slug: string;
  price: string;
  image: string | null;
  index?: number;
  id: string;
  storeSlug?: string;
}

const FALLBACK_PRODUCT_IMAGE = "https://cdn.cosmos.so/25e7ef9d-3d95-486d-b7db-f0d19c1992d7?format=jpeg";

// More subtle aspect ratio variations
const aspectVariants = [
  "aspect-[3/4]",
  "aspect-[4/5]",
  "aspect-[1/1]",
  "aspect-[4/5]",
  "aspect-[3/4]",
  "aspect-[5/6]",
];

export function ProductCard({ title, slug, price, image, index = 0, storeSlug, id }: ProductCardProps) {
  const params = useParams();
  const currentStoreSlug = storeSlug || (params?.s as string);
  const aspectClass = aspectVariants[index % aspectVariants.length];

  const imageUrl = image || FALLBACK_PRODUCT_IMAGE;
  const isBlobUrl = imageUrl.includes("blob.vercel-storage.com");

  return (
    <Link
      href={`/${currentStoreSlug}/${id}/${slug}`}
      className="group block break-inside-avoid mb-3 sm:mb-4 lg:mb-5"
    >
      {/* Image Container */}
      <div className={`relative overflow-hidden rounded-lg ${aspectClass} bg-muted`}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            className="object-cover transition-all duration-700 ease-out group-hover:scale-[1.03]"
            unoptimized={isBlobUrl}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Subtle hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </div>

      {/* Product Info - Clean and minimal */}
      <div className="mt-2 px-0.5">
        <h3 className="text-[13px] sm:text-sm font-normal text-foreground leading-tight line-clamp-2 mb-1">
          {title}
        </h3>
        <p className="text-xs sm:text-[13px] font-medium text-muted-foreground">
          {price}
        </p>
      </div>
    </Link>
  );
}