"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

interface ProductCardProps {
  title: string;
  slug: string;
  price: string;
  image: string | null;
  rating: number;
  index?: number;
}

const aspectVariants = [
  "aspect-[3/4]",
  "aspect-[4/5]",
  "aspect-[5/6]",
  "aspect-[1/1]",
  "aspect-[3/4]",
  "aspect-[4/5]",
  "aspect-[5/6]",
  "aspect-[1/1]",
];

export function ProductCard({ title, slug, price, image, index = 0 }: ProductCardProps) {
  const params = useParams();
  const storeSlug = params?.storefront as string;
  const aspectClass = aspectVariants[index % aspectVariants.length];

  return (
    <Link href={`/${storeSlug}/products/${slug}`} className="group block break-inside-avoid mb-8">
      <div className={`relative overflow-hidden rounded-none border-none bg-[#F2F0EA] ${aspectClass}`}>
        {image ? (
          <Image
            src={image}
            alt={title}
            width={500}
            height={500}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400">
            <span className="text-sm">No Image</span>
          </div>
        )}

        <div className="absolute bottom-3 left-3">
          <span className="
            inline-block
            rounded-sm
            bg-neutral-300/50 text-neutral-900/80 backdrop-blur-sm
            px-3 py-1
            text-sm font-semibold
          ">
            {price}
          </span>
        </div>
      </div>

      <div className="mt-3">
        <h3 className="text-sm md:text-base font-medium text-neutral-800 leading-snug">
          {title}
        </h3>
      </div>
    </Link>
  );
}
