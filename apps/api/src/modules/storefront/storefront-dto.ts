// Response DTOs for storefront API

export interface StoreHeaderDto {
    name: string;
    slug: string;
    description: string | null;
    rating: number;
    ratingCount: number;
    heroImage?: string;
}

export interface CategoryDto {
    slug: string;
    name: string;
    image: string | null;
}

export interface ProductDto {
    id: string;
    slug: string;
    name: string;
    price: number;
    currency: string;
    image: string | null;
    rating: number;
}

export interface StorefrontDataDto {
    store: StoreHeaderDto;
    categories: CategoryDto[];
    products: ProductDto[];
}
