import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
    id: number;
    title: string;
    price: string;
    image: string;
    rating: number;
}

export function ProductCard({ id, title, price, image }: ProductCardProps) {
  return (
    <Link href={`/store/products/${id}`} className="group block break-inside-avoid mb-8">
      <div className="relative overflow-hidden rounded-none border-none bg-[#F2F0EA]">
        <Image
          src={image}
          alt={title}
          width={500}
          height={500}
          className="w-full h-auto aspect-3/4 md:aspect-4/5 object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

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
