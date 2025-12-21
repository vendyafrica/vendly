import Header from "@/features/hero/header";
import HeroSearch from "@/features/hero/search";
import CategorySection from "@/features/category-sections/components/CategorySection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="relative pt-20">
        <section className="relative bg-background py-12">
          <HeroSearch />
        </section>
        <div className="bg-muted/30">
          <CategorySection title="Women" slug="women" />
          <CategorySection title="Men" slug="men" />
          <CategorySection title="Beauty" slug="beauty" />
          <CategorySection title="Gifts" slug="gifts" />
        </div>
      </main>
    </div>
  );
}