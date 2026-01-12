export interface CreateStorefrontRequest {
    tenantId: string;
    storeName: string;
    storeSlug: string;
    description?: string;
    themeId?: string;
    categories?: string[];
    location?: string;
    socialLinks?: {
        instagram?: string;
        facebook?: string;
        twitter?: string;
    };
}

export interface StorefrontResponse {
    id: string;
    tenantId: string;
    name: string;
    slug: string;
    description: string | null;
    status: string;
    theme: ThemeResponse;
    content: ContentResponse;
    createdAt: Date;
}

export interface ThemeResponse {
    id: string;
    preset: string;
    colors: Record<string, string>;
    typography: Record<string, any>;
    layout: Record<string, any>;
}

export interface ContentResponse {
    hero: HeroConfig;
    sections: SectionConfig[];
    footer: FooterConfig;
}

export interface HeroConfig {
    enabled: boolean;
    layout: "centered" | "split" | "fullscreen";
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
}

export interface SectionConfig {
    id: string;
    type: "products" | "categories" | "instagram" | "banner";
    title?: string;
    enabled: boolean;
    settings?: Record<string, any>;
}

export interface FooterConfig {
    showSocialLinks: boolean;
    showNewsletter: boolean;
    newsletterTitle?: string;
    copyright: string;
}