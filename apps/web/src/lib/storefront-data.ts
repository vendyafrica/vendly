import type { StorefrontData, Product, HeroImage } from "@/types/storefront";

/**
 * Mock Data for Storefront Development
 *
 * TODO: Replace with actual API calls when backend is ready
 * API Endpoints to implement:
 * - GET /api/public/stores/:slug - Store info + hero images
 * - GET /api/public/stores/:slug/products - All products
 * - GET /api/public/stores/:slug/products/new - New arrivals
 */

// Sample high-quality placeholder images (Unsplash)
const HERO_IMAGES: HeroImage[] = [
    {
        id: "hero-1",
        imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop",
        altText: "Fashion collection showcase",
        sortOrder: 0,
    },
    {
        id: "hero-2",
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop",
        altText: "Premium streetwear display",
        sortOrder: 1,
    },
    {
        id: "hero-3",
        imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&h=1080&fit=crop",
        altText: "Shopping experience",
        sortOrder: 2,
    },
];

const SAMPLE_PRODUCTS: Product[] = [
    {
        id: "prod-1",
        title: "Classic Cotton Tee",
        description: "Premium cotton t-shirt with minimal design",
        price: 2500,
        currency: "KES",
        images: [
            { id: "img-1", url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop", isFeatured: true },
        ],
        isFeatured: true,
        createdAt: "2026-01-18T10:00:00Z",
    },
    {
        id: "prod-2",
        title: "Leather Weekend Bag",
        description: "Handcrafted leather bag for the modern traveler",
        price: 12500,
        currency: "KES",
        images: [
            { id: "img-2", url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop", isFeatured: true },
        ],
        isFeatured: false,
        createdAt: "2026-01-17T10:00:00Z",
    },
    {
        id: "prod-3",
        title: "Minimalist Watch",
        description: "Clean design timepiece with leather strap",
        price: 8500,
        currency: "KES",
        images: [
            { id: "img-3", url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop", isFeatured: true },
        ],
        isFeatured: true,
        createdAt: "2026-01-16T10:00:00Z",
    },
    {
        id: "prod-4",
        title: "Denim Jacket",
        description: "Classic fit denim jacket in midnight blue",
        price: 6500,
        currency: "KES",
        images: [
            { id: "img-4", url: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&h=600&fit=crop", isFeatured: true },
        ],
        isFeatured: false,
        createdAt: "2026-01-15T10:00:00Z",
    },
    {
        id: "prod-5",
        title: "Canvas Sneakers",
        description: "Versatile low-top sneakers in off-white",
        price: 4500,
        currency: "KES",
        images: [
            { id: "img-5", url: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&h=600&fit=crop", isFeatured: true },
        ],
        isFeatured: false,
        createdAt: "2026-01-14T10:00:00Z",
    },
    {
        id: "prod-6",
        title: "Linen Shirt",
        description: "Breathable linen shirt perfect for summer",
        price: 3500,
        currency: "KES",
        images: [
            { id: "img-6", url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop", isFeatured: true },
        ],
        isFeatured: false,
        createdAt: "2026-01-13T10:00:00Z",
    },
    {
        id: "prod-7",
        title: "Wool Beanie",
        description: "Soft merino wool beanie in charcoal",
        price: 1500,
        currency: "KES",
        images: [
            { id: "img-7", url: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600&h=600&fit=crop", isFeatured: true },
        ],
        isFeatured: false,
        createdAt: "2026-01-12T10:00:00Z",
    },
    {
        id: "prod-8",
        title: "Crossbody Bag",
        description: "Compact crossbody bag in tan leather",
        price: 5500,
        currency: "KES",
        images: [
            { id: "img-8", url: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=600&fit=crop", isFeatured: true },
        ],
        isFeatured: false,
        createdAt: "2026-01-11T10:00:00Z",
    },
    {
        id: "prod-9",
        title: "Sunglasses",
        description: "Retro-inspired acetate sunglasses",
        price: 3000,
        currency: "KES",
        images: [
            { id: "img-9", url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop", isFeatured: true },
        ],
        isFeatured: false,
        createdAt: "2026-01-10T10:00:00Z",
    },
    {
        id: "prod-10",
        title: "Hooded Sweatshirt",
        description: "Heavyweight cotton hoodie in forest green",
        price: 4800,
        currency: "KES",
        images: [
            { id: "img-10", url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop", isFeatured: true },
        ],
        isFeatured: false,
        createdAt: "2026-01-09T10:00:00Z",
    },
];

/**
 * Get storefront data for a given store slug
 *
 * TODO: Replace with API call
 * const response = await fetch(`${API_URL}/api/public/stores/${slug}`);
 */
export async function getStorefrontData(slug: string): Promise<StorefrontData> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    // TODO: Fetch from API
    // const storeResponse = await fetch(`${API_URL}/api/public/stores/${slug}`);
    // const productsResponse = await fetch(`${API_URL}/api/public/stores/${slug}/products`);
    // const newArrivalsResponse = await fetch(`${API_URL}/api/public/stores/${slug}/products/new?limit=8`);

    return {
        store: {
            id: "store-1",
            name: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " "),
            slug: slug,
            description: "Premium curated collection",
            currency: "KES",
        },
        heroImages: HERO_IMAGES,
        products: SAMPLE_PRODUCTS,
        newArrivals: SAMPLE_PRODUCTS.slice(0, 8),
    };
}

/**
 * Format price with currency
 */
export function formatPrice(amount: number, currency: string = "KES"): string {
    return new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 0,
    }).format(amount);
}
