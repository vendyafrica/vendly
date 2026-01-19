import Link from "next/link";
import { StorefrontHeader } from "./components/header";
import { FeaturedSection } from "./components/featured";
import { ProductGrid } from "./components/product-grid";
import { StorefrontFooter } from "./components/footer";
import { Hero } from "./components/hero";
import { Categories } from "./components/categories";
import { StoreConfiguration } from "@vendly/ui/src/types/store-config";
import { StoreThemeProvider } from "@vendly/ui/components/theme-provider";

const DUMMY_STORE_CONFIG: StoreConfiguration = {
    id: "store_123",
    theme: {
        colors: {
            // Changed to a deep blue to demonstrate the theme engine working
            primary: "#1e3a8a",
            secondary: "#ffffff",
            accent: "#f3f4f6",
            background: "#ffffff",
            foreground: "#000000"
        },
        typography: {
            fontFamily: "serif" // Changed to serif to show font switching
        },
        radius: "0.5rem"
    },
    content: {
        header: {
            storeName: "My Custom Store", // Changed text
            navLinks: [
                { label: "Home", href: "/" },
                { label: "New Arrivals", href: "/collections" }, // Changed text
                { label: "Categories", href: "/categories" }
            ]
        },
        hero: {
            headline: "Configuration Driven \n Design System", // Changed text
            subheadline: "It Works!", // Changed text
            backgroundImage: "/images/hero-desktop.png",
            ctaText: "Explore Now", // Changed text
            ctaLink: "/products"
        },
        featured: {
            title: "Featured Collections",
            items: [
                {
                    id: "f1",
                    title: "Classic Elegance",
                    imageUrl: "/images/woman-fashion.png",
                    link: "/collections/women",
                    ctaText: "Shop Women"
                },
                {
                    id: "f2",
                    title: "Refined Gentleman",
                    imageUrl: "/images/man-fashion.png",
                    link: "/collections/men",
                    ctaText: "Shop Men"
                }
            ]
        },
        categories: {
            title: "New Arrivals",
            items: [
                { name: "Women's Fashion", slug: "womens-fashion", imageUrl: "/images/trench-coat.png" },
                { name: "Men's Fashion", slug: "mens-fashion", imageUrl: "/images/navy-blazer.png" },
                { name: "Accessories", slug: "accessories", imageUrl: "/images/tortoiseshell-sunglasses.png" },
                { name: "Shoes", slug: "shoes", imageUrl: "/images/leather-loafers.png" },
                { name: "Shirts", slug: "shirts", imageUrl: "/images/linen-shirt.png" },
                { name: "Knitwear", slug: "knitwear", imageUrl: "/images/cable-knit-sweater.png" },
            ]
        },
        footer: {
            copyrightText: "© 2024 vendly. All rights reserved."
        }
    }
};

export default async function StorefrontHomePage() {
    return (
        <StoreThemeProvider config={DUMMY_STORE_CONFIG.theme}>
            <div className="min-h-screen bg-white">
                <StorefrontHeader config={DUMMY_STORE_CONFIG.content.header} />

                <Hero config={DUMMY_STORE_CONFIG.content.hero} />

                <div className="max-w-7xl mx-auto px-6 py-12">
                    {/* Categories */}
                    <Categories config={DUMMY_STORE_CONFIG.content.categories} />

                    {/* Product Grid */}
                    <h3 className="text-lg font-semibold m-8">All Products</h3>
                    <ProductGrid />

                    {/* Spacing */}
                    <div className="my-20" />

                    {/* Featured Section */}
                    <FeaturedSection config={DUMMY_STORE_CONFIG.content.featured} />
                </div>

                <StorefrontFooter />
            </div>
        </StoreThemeProvider>
    );
}
