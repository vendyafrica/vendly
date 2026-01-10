export interface CreateStoreRequest {
    tenantSlug: string; // The tenant this store belongs to
    name: string;
    slug: string; // The subdomain/slug for the store
    theme?: any; // Initial theme config
}

export interface UpdateStoreRequest {
    name?: string;
    description?: string;
    theme?: any;
    content?: any;
}

export interface StoreResponse {
    id: string;
    tenantId: string;
    name: string;
    slug: string;
    description: string | null;
    status: string;
    logoUrl: string | null;
    theme: any;
    content: any;
    defaultCurrency: string;
    createdAt: Date;
}
