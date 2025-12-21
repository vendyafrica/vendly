import { ChevronRight } from "lucide-react";
import Link from "next/link";
import ShopCard from "./shop-card";

interface Shop {
  id: string;
  name: string;
  images: string[]; // Array of product images
  pfp: string;
  rating: number;
  reviewCount?: number;
}

interface MarketplaceSectionProps {
  title: string;
  slug: string;
  shops: Shop[];
}

const MarketplaceSection = ({ title, slug, shops }: MarketplaceSectionProps) => {
  // Show only first 8 shops (5 in first row, 3 in second)
  const displayedShops = shops.slice(0, 8);

  return (
    <section className="py-8 px-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <Link 
          href={`/marketplace/${slug}`}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          See more
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
        {displayedShops.map((shop) => (
          <ShopCard
            key={shop.id}
            name={shop.name}
            images={shop.images}
            pfp={shop.pfp}
            rating={shop.rating}
            reviewCount={shop.reviewCount}
          />
        ))}
      </div>
    </section>
  );
};

export default MarketplaceSection;
