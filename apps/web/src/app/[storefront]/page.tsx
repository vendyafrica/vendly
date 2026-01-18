import Link from "next/link";
import { StorefrontHeader } from "./components/header";
import { FeaturedSection } from "./components/featured";
import { ProductGrid } from "./components/product-grid";
import { StorefrontFooter } from "./components/footer";
import { Hero } from "./components/hero";
import Image from "next/image"; // Added Image import as it was missing in the provided new content, but used in JSX

export default async function StorefrontHomePage() {
    return (
        <div className="min-h-screen bg-white">
            <StorefrontHeader />

            <Hero />

            <div className="max-w-7xl mx-auto px-6 py-12">
                <h1 className="text-2xl font-bold m-8">New Arrivals</h1>

                {/* Categories */}
                <div className="flex gap-4 m-6  overflow-x-auto no-scrollbar pb-4">
                    {[
                        { name: "Women's Fashion", image: "/images/trench-coat.png" },
                        { name: "Men's Fashion", image: "/images/navy-blazer.png" },
                        { name: "Accessories", image: "/images/tortoiseshell-sunglasses.png" },
                        { name: "Shoes", image: "/images/leather-loafers.png" },
                        { name: "Shirts", image: "/images/linen-shirt.png" },
                        { name: "Knitwear", image: "/images/cable-knit-sweater.png" },
                    ].map((category) => (
                        <div key={category.name} className="flex flex-col items-center gap-2 shrink-0 cursor-pointer group">
                            <div className="w-24 h-24 md:w-32 md:h-32 relative rounded-2xl overflow-hidden bg-neutral-100 border border-transparent group-hover:border-neutral-200 transition-all">
                                <Image
                                    src={category.image}
                                    alt={category.name}
                                    fill
                                    className="object-cover mix-blend-multiply opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                />
                            </div>
                            <span className="text-xs md:text-sm font-medium text-neutral-600 group-hover:text-black text-center">
                                {category.name}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Product Grid */}
                <h3 className="text-lg font-semibold m-8">All Products</h3>
                <ProductGrid />

                {/* Spacing */}
                <div className="my-20" />

                {/* Featured Section */}
                <FeaturedSection />
            </div>

            <StorefrontFooter />
        </div>
    );
}
