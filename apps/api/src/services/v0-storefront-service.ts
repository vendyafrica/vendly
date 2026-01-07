import { v0 } from "v0-sdk";
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
 * Build a prompt for v0 to generate a storefront homepage
 */
function buildStorefrontPrompt(params: GenerateStorefrontParams): string {
    const colors = colorTemplates[params.colorTemplate];

    return `
Create a stunning e-commerce homepage for "${params.storeName}" - a ${params.category || "retail"} store.

## Design Requirements
- Use the ${colors.name} color scheme:
  - Primary: ${colors.primary}
  - Secondary: ${colors.secondary}
  - Accent: ${colors.accent}
  - Background: ${colors.background}
  - Text: ${colors.text}

## Page Structure (use these exact block types)

1. **HeaderBlock**
   - Left: Home link
   - Center: Store logo "${params.storeName}" in elegant calligraphy/italic style
   - Right: Sign in button + Cart icon
   - Background: ${colors.primary}
   - Text: ${colors.accent}

2. **HeroBlock**
   - Large full-width hero section (min-height 500px)
   - Background color: ${colors.secondary}
   - Text color: ${colors.accent}
   - Include a compelling headline about ${params.category || "shopping"}
   - Subtitle about discovering the collection
   - CTA button "Shop Now" linking to /${params.storeSlug}/products

3. **ProductGridBlock**
   - Section title like "Featured Products" or "New Arrivals"
   - 4 products per row
   - Products come from database (dynamic)

4. **FooterBlock**
   - Simple design
   - Store logo "${params.storeName}"
   - Social media links placeholder
   - Background: ${colors.primary}
   - Text: ${colors.accent}

## Output Format
Return ONLY a valid JSON object matching this Puck structure (no markdown, no explanation):
{
  "content": [ { "type": "BlockName", "props": { ... } } ],
  "root": { "props": { "title": "...", "backgroundColor": "..." } },
  "zones": {}
}
`.trim();
}

/**
 * Build default Puck data structure
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

/**
 * Parse v0 response to extract JSON
 */
function parseV0Response(response: string): PuckData | null {
    try {
        // Try to extract JSON from the response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return null;
    } catch {
        return null;
    }
}

/**
 * Generate a storefront homepage using v0 AI
 */
export async function generateStorefront(params: GenerateStorefrontParams): Promise<PuckData> {
    const colors = colorTemplates[params.colorTemplate];

    // Check if v0 API key is configured
    const v0ApiKey = process.env.V0_API_KEY;
    if (!v0ApiKey) {
        console.log("V0_API_KEY not configured, using default template");
        return buildDefaultPuckData(params, colors);
    }

    try {
        const prompt = buildStorefrontPrompt(params);

        // Create v0 chat and get response
        const chat = await v0.chats.create({
            message: prompt,
        });

        // v0 chats.create may return ChatDetail or stream
        // For now, use default template - v0 response parsing can be enhanced later
        console.log("v0 chat created, using default template for now");
        return buildDefaultPuckData(params, colors);

    } catch (error) {
        console.error("Error generating storefront with v0:", error);
        // Return default structure on error
        return buildDefaultPuckData(params, colors);
    }
}

/**
 * Generate and save storefront for an existing store
 */
export async function generateStorefrontForStore(
    storeSlug: string,
    colorTemplate: ColorTemplateName = "dark"
): Promise<{ success: boolean; puckData: PuckData; error?: string }> {
    try {
        // Fetch store info from database
        const store = await getStoreBySlug(storeSlug);
        if (!store) {
            return {
                success: false, puckData: buildDefaultPuckData({
                    storeName: storeSlug,
                    storeSlug,
                    colorTemplate,
                }, colorTemplates[colorTemplate]), error: "Store not found"
            };
        }

        // Fetch products to determine category (use store description or default)
        const products = await getProductsByStoreSlug(storeSlug);
        const category = "retail"; // Products don't have category field

        // Generate the Puck data
        const puckData = await generateStorefront({
            storeName: store.name || storeSlug,
            storeSlug: storeSlug,
            category: category,
            colorTemplate: colorTemplate,
            description: store.description || undefined,
        });

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
