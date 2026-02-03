export interface MarketplaceStore {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    logoUrl?: string | null;
    instagramAvatarUrl?: string | null;
    images?: string[];
    heroMedia?: string | null;
    heroMediaType?: "image" | "video" | null;
    heroMediaItems?: Array<{ url: string; type: "image" | "video" }>;
    rating: number;
    categories: string[];
}
