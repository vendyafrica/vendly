import { Card } from "@vendly/ui/components/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { StarIcon, HeartAddIcon } from "@hugeicons/core-free-icons";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
    id: number;
    title: string;
    price: string;
    image: string;
    rating: number;
}

export function ProductCard({ id, title, price, image, rating }: ProductCardProps) {
    return (
        <Link href={`/store/products/${id}`} className="flex flex-col group">
            {/* Image / Media */}
            <Card className="relative aspect-square overflow-hidden rounded-xl transition-shadow hover:shadow-md cursor-pointer border-none bg-[#F2F0EA]">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Wishlist button */}
                <button
                    className="absolute top-3 right-3 z-10 rounded-full bg-white/80 p-2 backdrop-blur-sm
                               transition-all hover:bg-white cursor-pointer opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300"
                    aria-label="Add to wishlist"
                >
                    <HugeiconsIcon
                        icon={HeartAddIcon}
                        className="w-5 h-5 text-gray-600 transition-colors hover:text-red-500"
                    />
                </button>
            </Card>

            {/* Details */}
            <div className="mt-4 space-y-1">
                <div className="flex justify-between items-start gap-2">
                    <div className="flex flex-col">
                        <h3 className="text-base font-medium leading-tight text-neutral-900 group-hover:text-neutral-700 transition-colors">
                            {title}
                        </h3>
                        <p className="text-sm font-semibold text-neutral-900 mt-1">{price}</p>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-medium text-neutral-600 bg-neutral-100 px-2 py-1 rounded-full">
                        <HugeiconsIcon
                            icon={StarIcon}
                            className="w-3 h-3 text-orange-400 fill-orange-400"
                        />
                        <span>{rating}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
