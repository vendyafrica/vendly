"use client";

import type { ShopCardShop } from "@/features/shop-card/shop-card";
import { useCategoryShops } from "../hooks/useCategoryShops";
import CategoryHeader from "./CategoryHeader";
import ShopGrid from "./ShopGrid";

export type CategorySectionProps = {
  title: string;
  slug: string;
  shops?: ShopCardShop[];
};

export default function CategorySection({ title, slug, shops }: CategorySectionProps) {
  const categories = useCategoryShops();
  const resolvedShops = shops ?? categories.find((c) => c.slug === slug)?.shops ?? [];
  const displayedShops = resolvedShops.slice(0, 8);

  return (
    <section className="py-8 px-6">
      <CategoryHeader title={title} slug={slug} />
      <ShopGrid shops={displayedShops} />
    </section>
  );
}
