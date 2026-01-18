/**
 * Storefront Types
 * These interfaces define the shape of data for the storefront template
 */

export interface StoreInfo {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    currency: string;
}

export interface HeroImage {
    id: string;
    imageUrl: string;
    altText: string | null;
    sortOrder: number;
}

export interface ProductImage {
    id: string;
    url: string;
    isFeatured: boolean;
}

export interface Product {
    id: string;
    title: string;
    description: string | null;
    price: number;
    currency: string;
    images: ProductImage[];
    isFeatured: boolean;
    createdAt: string;
}

export interface StorefrontData {
    store: StoreInfo;
    heroImages: HeroImage[];
    products: Product[];
    newArrivals: Product[];
}
