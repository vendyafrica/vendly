export interface MarketplaceStore {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    logoUrl?: string | null;
    images?: string[];
    rating: number;
    categories: string[];
}
