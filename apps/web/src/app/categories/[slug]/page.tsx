import ShopListingPage from "@/features/shop-discovery/components/ShopListingPage";

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  return <ShopListingPage slug={slug} />;
}
