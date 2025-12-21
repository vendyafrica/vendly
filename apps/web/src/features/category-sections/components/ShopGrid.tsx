import type { ShopCardShop } from "@/features/shop-card/shop-card";
import ShopCard from "@/features/shop-card/shop-card";

export type ShopGridProps = {
  shops: ShopCardShop[];
};

export default function ShopGrid({ shops }: ShopGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
      {shops.map((shop) => (
        <ShopCard key={shop.id} shop={shop} />
      ))}
    </div>
  );
}
