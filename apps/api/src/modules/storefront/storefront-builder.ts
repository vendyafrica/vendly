import {
    CreateStorefrontRequest,
    StorefrontResponse,
} from "./storefront-types";
import type { SectionConfig } from "./storefront-types";
import { Store, StoreContent, StoreTheme } from "@vendly/db";

const allowedSectionTypes: SectionConfig["type"][] = [
    "products",
    "categories",
    "instagram",
    "banner",
];

type SectionInput = NonNullable<StoreContent["sections"]>[number];

const sanitizeColors = (colors?: StoreTheme["colors"]): Record<string, string> =>
    colors
        ? Object.fromEntries(
              Object.entries(colors).filter(
                  (entry): entry is [string, string] => typeof entry[1] === "string"
              )
          )
        : {};

export const buildStoreData = (request: CreateStorefrontRequest) => ({
    tenantId: request.tenantId,
    name: request.storeName,
    slug: request.storeSlug,
    description: request.description || "",
    status: "draft" as const,
    defaultCurrency: "KES" as const,
    instagramUrl: request.socialLinks?.instagram,
    facebookUrl: request.socialLinks?.facebook,
    twitterUrl: request.socialLinks?.twitter,
    address: request.location,
});

export const buildThemeData = (
    tenantId: string,
    storeId: string,
    templateId?: string
) => ({
    tenantId,
    storeId,
    templateId: templateId || null,
    preset: "minimal" as const,
    colors: {
        primary: '#285570',
        secondary: '#e3ded7',
        background: '#faf7f6',
        foreground: '#333333',
        muted: '#e3ded7',
        mutedForeground: '#666666',
        border: '#cbcac7',
        input: '#ffffff',
        ring: '#285570',
    },
    typography: {
        fontFamily: 'Inter',
        headingFont: 'Playfair Display',
        bodyFont: 'Inter',
    },
    layout: {
        containerWidth: 'wide' as const,
        borderRadius: 'none' as const,
    },
    components: {
        buttonStyle: 'solid' as const,
        cardStyle: 'flat' as const,
    },
});

export const buildContentData = (
    tenantId: string,
    storeId: string,
    storeName: string
) => ({
    tenantId,
    storeId,
    hero: {
        enabled: true,
        layout: "centered" as const,
        label: "New Collection",
        title: `Welcome to ${storeName}`,
        subtitle: "Discover our premium collection.",
        ctaText: "Shop Now",
        ctaLink: "/shop",
        backgroundOverlay: true,
    },
    sections: [
        {
            id: "featured-collection",
            type: "products" as const,
            title: "Featured Products",
            enabled: true,
            settings: {
                layout: "grid" as const,
                columns: 3 as const,
                showPrices: true as const,
            },
        },
        {
            id: "brand-story",
            type: "banner" as const,
            title: "Our Story",
            subtitle: "Crafted with passion.",
            enabled: true,
        },
    ],
    footer: {
        showSocialLinks: true,
        showNewsletter: true,
        newsletterTitle: "Join the community",
        copyright: `© ${new Date().getFullYear()} ${storeName}. All rights reserved.`,
    },
});

export const buildStorefrontResponse = (
    store: Store,
    theme: StoreTheme,
    content: StoreContent
): StorefrontResponse => ({
    id: store.id,
    tenantId: store.tenantId,
    name: store.name,
    slug: store.slug,
    description: store.description ?? "",
    status: store.status,
    theme: {
        id: theme.id,
        preset: theme.preset ?? "minimal",
        colors: sanitizeColors(theme.colors),
        typography: (theme.typography ?? {}) as Record<string, unknown>,
        layout: (theme.layout ?? {}) as Record<string, unknown>,
    },
    content: {
        hero: {
            enabled: content.hero?.enabled ?? false,
            layout: content.hero?.layout ?? "centered",
            title: content.hero?.title ?? "",
            subtitle: content.hero?.subtitle ?? "",
            ctaText: content.hero?.ctaText ?? "",
            ctaLink: content.hero?.ctaLink ?? "",
        },
        sections: (content.sections ?? [])
            .filter(
                (
                    section
                ): section is SectionInput & {
                    type: SectionConfig["type"];
                    settings?: Record<string, unknown>;
                } =>
                    allowedSectionTypes.includes(
                        section.type as SectionConfig["type"]
                    )
            )
            .map((section) => ({
                id: section.id,
                type: section.type,
                title: section.title,
                enabled: section.enabled ?? false,
                settings: (section.settings ?? {}) as Record<string, unknown>,
            })),
        footer: {
            showSocialLinks: content.footer?.showSocialLinks ?? false,
            showNewsletter: content.footer?.showNewsletter ?? false,
            newsletterTitle: content.footer?.newsletterTitle ?? "",
            copyright: content.footer?.copyright ?? "",
        },
    },
    createdAt: store.createdAt,
});