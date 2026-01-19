import { StoreConfiguration } from "../types/store-config";

export const MINIMAL_STORE: StoreConfiguration = {
    id: "minimal_store_001",
    name: "Minimalist Boutique",
    themeVariant: "minimal",
    domain: "minimal.vendly.com",
    content: {
        header: {
            storeName: "Minimalist",
            navLinks: [
                { label: "Home", href: "/" },
                { label: "Shop", href: "/products" },
                { label: "Contact", href: "/contact" }
            ]
        },
        hero: {
            headline: "Pure \n Simplicity",
            subheadline: "Timeless Design",
            backgroundImage: "/images/man-fashion.png",
            ctaText: "Explore",
            ctaLink: "/products"
        },
        featured: {
            title: "Essentials",
            items: [
                {
                    id: "min_1",
                    title: "Clean Lines",
                    imageUrl: "/images/linen-shirt.png",
                    link: "/collections/essentials",
                    ctaText: "View Collection"
                },
                {
                    id: "min_2",
                    title: "Pure Forms",
                    imageUrl: "/images/leather-loafers.png",
                    link: "/collections/accessories",
                    ctaText: "Shop Now"
                }
            ]
        },
        categories: {
            title: "Categories",
            items: [
                { name: "Basics", slug: "basics", imageUrl: "/images/leather-loafers.png" },
                { name: "Outerwear", slug: "outerwear", imageUrl: "/images/leather-loafers.png" },
                { name: "Accessories", slug: "accessories", imageUrl: "/images/leather-loafers.png" },
                { name: "Footwear", slug: "footwear", imageUrl: "/images/leather-loafers.png" }
            ]
        },
        footer: {
            copyrightText: "© 2026 {storeName}. All rights reserved."
        }
    }
};

export const WARM_STORE: StoreConfiguration = {
    id: "warm_store_001",
    name: "Cozy Corner",
    themeVariant: "warm",
    domain: "cozy.vendly.com",
    content: {
        header: {
            storeName: "Cozy Corner",
            navLinks: [
                { label: "Home", href: "/" },
                { label: "Collections", href: "/collections" },
                { label: "Seasonal", href: "/seasonal" },
                { label: "About", href: "/about" }
            ]
        },
        hero: {
            headline: "Warm & \n Welcoming",
            subheadline: "Comfort Meets Style",
            backgroundImage: "/images/hero-warm.png",
            ctaText: "Shop Cozy",
            ctaLink: "/products"
        },
        featured: {
            title: "Seasonal Favorites",
            items: [
                {
                    id: "warm_1",
                    title: "Autumn Comfort",
                    imageUrl: "/images/autumn-collection.png",
                    link: "/collections/autumn",
                    ctaText: "Browse Collection"
                },
                {
                    id: "warm_2",
                    title: "Winter Warmth",
                    imageUrl: "/images/winter-essentials.png",
                    link: "/collections/winter",
                    ctaText: "Stay Warm"
                }
            ]
        },
        categories: {
            title: "Comfort Categories",
            items: [
                { name: "Knitwear", slug: "knitwear", imageUrl: "/images/knitwear.png" },
                { name: "Sweaters", slug: "sweaters", imageUrl: "/images/sweaters.png" },
                { name: "Scarves", slug: "scarves", imageUrl: "/images/scarves.png" },
                { name: "Boots", slug: "boots", imageUrl: "/images/boots.png" },
                { name: "Home", slug: "home", imageUrl: "/images/home-goods.png" },
                { name: "Blankets", slug: "blankets", imageUrl: "/images/blankets.png" }
            ]
        },
        footer: {
            copyrightText: "© 2026 {storeName}. Embrace the warmth."
        }
    }
};

export const COOL_STORE: StoreConfiguration = {
    id: "cool_store_001",
    name: "Cool",
    themeVariant: "cool",
    domain: "cool.vendly.com",
    content: {
        header: {
            storeName: "Cool",
            navLinks: [
                { label: "Home", href: "/" },
                { label: "New Arrivals", href: "/new" },
                { label: "Professional", href: "/professional" },
                { label: "Casual", href: "/casual" },
                { label: "Tech", href: "/tech" }
            ]
        },
        hero: {
            headline: "Modern \n Innovation",
            subheadline: "Professional Meets Style",
            backgroundImage: "/images/hero-desktop.png",
            ctaText: "Discover",
            ctaLink: "/products"
        },
        featured: {
            title: "Professional Collections",
            items: [
                {
                    id: "cool_1",
                    title: "Business Ready",
                    imageUrl: "/images/leather-loafers.png",
                    link: "/collections/business",
                    ctaText: "Shop Professional"
                },
                {
                    id: "cool_2",
                    title: "Tech Forward",
                    imageUrl: "/images/navy-blazer.png",
                    link: "/collections/tech",
                    ctaText: "Explore Tech"
                }
            ]
        },
        categories: {
            title: "Professional Categories",
            items: [
                { name: "Suits", slug: "suits", imageUrl: "/images/leather-loafers.png" },
                { name: "Shirts", slug: "shirts", imageUrl: "/images/leather-loafers.png" },
                { name: "Tech Wear", slug: "tech-wear", imageUrl: "/images/leather-loafers.png" },
                { name: "Accessories", slug: "professional-accessories", imageUrl: "/images/leather-loafers.png" },
                { name: "Bags", slug: "bags", imageUrl: "/images/leather-loafers.png" },
                { name: "Watches", slug: "watches", imageUrl: "/images/leather-loafers.png" }
            ]
        },
        footer: {
            copyrightText: "© 2026 {storeName}. Redefining professional style."
        }
    }
};

// Export all configurations
export const SAMPLE_STORES = {
    minimal: MINIMAL_STORE,
    warm: WARM_STORE,
    cool: COOL_STORE
} as const;

export type SampleStoreKey = keyof typeof SAMPLE_STORES;
