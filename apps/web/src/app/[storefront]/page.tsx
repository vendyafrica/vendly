import { ProductGrid } from "./components/product-grid";
import { StorefrontFooter } from "./components/footer";
import { Categories } from "./components/categories";
import { Hero } from "./components/hero";

export default async function StorefrontHomePage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <div className="w-full">
        <Categories />
        <div className="px-8">
           <h3 className="text-lg font-semibold my-8 text-neutral-900">
             All Products
           </h3>
           <ProductGrid />
        </div>
        <div className="my-20" />
      </div>
      <StorefrontFooter />
    </div>
  );
}