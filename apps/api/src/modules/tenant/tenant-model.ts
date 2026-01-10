export interface CreateTenantRequest {
    name: string;
    slug: string;
    billingEmail?: string;
}

export interface UpdateTenantRequest {
    name?: string;
    settings?: Record<string, any>;
    billingEmail?: string;
}

export interface TenantResponse {
    id: string;
    name: string;
    slug: string;
    status: string;
    plan: string | null;
    billingEmail: string | null;
    createdAt: Date;
}
