/**
 * Template-based Storefront Service
 * 
 * Generates Puck configurations from pre-built templates instead of AI.
 */
import { colorTemplates, type ColorTemplateName } from "../lib/color-templates";
import { getStoreBySlug, getProductsByStoreSlug, upsertStorePageData } from "@vendly/db/storefront-queries";

export interface GenerateStorefrontParams {
    storeName: string;
    storeSlug: string;
    category?: string;
    colorTemplate: ColorTemplateName;
    heroImageUrl?: string;
    description?: string;
}

export interface PuckData {
    content: Array<{
        type: string;
        props: Record<string, unknown>;
    }>;
    root: {
        props: Record<string, unknown>;
    };
    zones?: Record<string, unknown>;
}

/**
 * Build Fashion template Puck data
 */
function buildFashionPuckData(
    params: GenerateStorefrontParams,
    colors: typeof colorTemplates[ColorTemplateName]
): PuckData {
    return {
        content: [
            {
                type: "FashionHeader",
                props: {
                    id: "header-1",
                    storeName: params.storeName,
                    storeSlug: params.storeSlug,
                    backgroundColor: colors.primary,
                    textColor: colors.accent,
                    showHome: true,
                    showShop: true,
                    showCart: true,
                    showUser: true,
                },
            },
            {
                type: "FashionHero",
                props: {
                    id: "hero-1",
                    label: params.category?.toUpperCase() || "FASHION",
                    title: `Style at ${params.storeName}`,
                    ctaText: "Shop Now",
                    ctaLink: `/${params.storeSlug}/products`,
                    ctaPadding: "16px 32px",
                    imageUrl: params.heroImageUrl || "",
                    overlayColor: "rgba(0, 0, 0, 0.4)",
                },
            },
            {
                type: "FashionCategoryTabs",
                props: {
                    id: "categories-1",
                    categoriesText: "Women, Men",
                    showSection: true,
                },
            },
            {
                type: "FashionProductGrid",
                props: {
                    id: "products-1",
                    title: "New Arrivals",
                    showTitle: true,
                    columns: 4,
                    storeSlug: params.storeSlug,
                },
            },
            {
                type: "FashionFooter",
                props: {
                    id: "footer-1",
                    storeName: params.storeName,
                    storeSlug: params.storeSlug,
                    backgroundColor: colors.primary,
                    textColor: colors.accent,
                    socialLinks: {
                        instagram: "#",
                        whatsapp: "#",
                        twitter: "#",
                    },
                    showPoweredBy: true,
                },
            },
        ],
        root: {
            props: {
                title: `${params.storeName} - Fashion Store`,
                description: params.description || `Welcome to ${params.storeName}`,
                backgroundColor: colors.background,
                primaryColor: colors.primary,
                textColor: colors.text,
                headingFont: "Playfair Display",
                bodyFont: "Inter",
            },
        },
        zones: {},
    };
}

/**
 * Generate default Puck data (legacy - for non-fashion templates)
 */
function buildDefaultPuckData(
    params: GenerateStorefrontParams,
    colors: typeof colorTemplates[ColorTemplateName]
): PuckData {
    return {
        content: [
            {
                type: "HeaderBlock",
                props: {
                    id: "header-1",
                    storeName: params.storeName,
                    backgroundColor: colors.primary,
                    textColor: colors.accent,
                    showSignIn: true,
                    showCart: true,
                    storeSlug: params.storeSlug,
                },
            },
            {
                type: "HeroBlock",
                props: {
                    id: "hero-1",
                    label: params.category?.toUpperCase() || "STYLE",
                    title: `Discover ${params.storeName}'s Collection`,
                    subtitle: params.description || "Explore our curated selection of premium products designed for the modern lifestyle.",
                    ctaText: "Shop Now",
                    ctaLink: `/${params.storeSlug}/products`,
                    backgroundColor: colors.secondary,
                    textColor: colors.accent,
                    imageUrl: params.heroImageUrl || null,
                },
            },
            {
                type: "ProductGridBlock",
                props: {
                    id: "products-1",
                    title: "Featured Products",
                    showTitle: true,
                    columns: 4,
                    maxProducts: 8,
                    storeSlug: params.storeSlug,
                },
            },
            {
                type: "FooterBlock",
                props: {
                    id: "footer-1",
                    storeName: params.storeName,
                    showNewsletter: false,
                    backgroundColor: colors.primary,
                    textColor: colors.accent,
                    storeSlug: params.storeSlug,
                    socialLinks: {
                        instagram: "#",
                        twitter: "#",
                        facebook: "#",
                    },
                },
            },
        ],
        root: {
            props: {
                title: `${params.storeName} - Home`,
                description: params.description || `Welcome to ${params.storeName}`,
                backgroundColor: colors.background,
                primaryColor: colors.primary,
                textColor: colors.text,
                headingFont: "Playfair Display",
                bodyFont: "Inter",
            },
        },
        zones: {},
    };
}

export type TemplateType = "fashion" | "default";

/**
 * Generate a storefront using templates
 */
export async function generateStorefront(
    params: GenerateStorefrontParams,
    template: TemplateType = "fashion"
): Promise<PuckData> {
    const colors = colorTemplates[params.colorTemplate];

    switch (template) {
        case "fashion":
            return buildFashionPuckData(params, colors);
        default:
            return buildDefaultPuckData(params, colors);
    }
}

/**
 * Generate and save storefront for an existing store
 */
export async function generateStorefrontForStore(
    storeSlug: string,
    colorTemplate: ColorTemplateName = "dark",
    template: TemplateType = "fashion"
): Promise<{ success: boolean; puckData: PuckData; error?: string }> {
    try {
        // Fetch store info from database
        const store = await getStoreBySlug(storeSlug);
        if (!store) {
            return {
                success: false,
                puckData: buildDefaultPuckData({
                    storeName: storeSlug,
                    storeSlug,
                    colorTemplate,
                }, colorTemplates[colorTemplate]),
                error: "Store not found"
            };
        }

        // Determine category
        const category = "fashion";

        // Generate the Puck data
        const puckData = await generateStorefront({
            storeName: store.name || storeSlug,
            storeSlug: storeSlug,
            category: category,
            colorTemplate: colorTemplate,
            description: store.description || undefined,
        }, template);

        // Save to database
        await upsertStorePageData(store.id, puckData);

        return { success: true, puckData };
    } catch (error) {
        console.error("Error generating storefront for store:", error);
        return {
            success: false,
            puckData: buildDefaultPuckData({
                storeName: storeSlug,
                storeSlug,
                colorTemplate,
            }, colorTemplates[colorTemplate]),
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}
