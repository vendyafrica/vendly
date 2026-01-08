// Marketplace store categories
export const MARKETPLACE_CATEGORIES = ["Men", "Women", "Kids", "Electronics", "Home"] as const;

export type MarketplaceCategory = typeof MARKETPLACE_CATEGORIES[number];

// Extended store type for marketplace display
export interface MarketplaceStore {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    logoUrl?: string | null;
    coverUrl?: string | null;
    category: MarketplaceCategory;
    tenantId: string;
    status: "active" | "suspended" | "draft";
    defaultCurrency: string;
    createdAt: Date | string;
    updatedAt: Date | string;
    images?: string[];
    rating?: number;
}
