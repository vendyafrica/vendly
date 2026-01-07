/**
 * AI Gateway Service
 * Uses Vercel AI SDK with Vercel AI Gateway (OpenAI compatible) to generate storefronts
 */
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

// Initialize Vercel AI Gateway provider (OpenAI compatible)
const gateway = createOpenAI({
    baseURL: "https://ai-gateway.vercel.sh/v1", // Standard Vercel AI Gateway URL
    apiKey: process.env.AI_GATEWAY_API_KEY,    // User's AI Gateway Key
    headers: {
        "x-vercel-ai-provider": "google", // Hint to prioritize Google provider
    },
});

export interface StorefrontInput {
    storeName: string;
    storeSlug: string;
    category: string;
    theme?: {
        name: string;
        description: string;
        cssVariables: {
            background: string;
            foreground: string;
            primary: string;
            primaryForeground: string;
            secondary: string;
            secondaryForeground: string;
            muted: string;
            mutedForeground: string;
            accent: string;
            accentForeground: string;
            border: string;
            radius: string;
        };
    };
}

export interface GeneratedFile {
    name: string;
    content: string;
}

export interface GeneratedStorefront {
    files: GeneratedFile[];
    demoHtml: string;
}

function buildStorefrontPrompt(input: StorefrontInput, apiBaseUrl: string): string {
    const { storeName, storeSlug, category, theme } = input;

    let themeInstructions = "";
    if (theme?.cssVariables) {
        const vars = theme.cssVariables;
        themeInstructions = `
THEME: "${theme.name}" - ${theme.description}

APPLY THESE EXACT COLORS as CSS variables:
--background: ${vars.background};
--foreground: ${vars.foreground};
--primary: ${vars.primary};
--primary-foreground: ${vars.primaryForeground};
--secondary: ${vars.secondary};
--secondary-foreground: ${vars.secondaryForeground};
--muted: ${vars.muted};
--muted-foreground: ${vars.mutedForeground};
--accent: ${vars.accent};
--accent-foreground: ${vars.accentForeground};
--border: ${vars.border};
--radius: ${vars.radius};
`;
    }

    return `You are an expert web developer. Generate a complete, production-ready ecommerce storefront using vanilla HTML, CSS, and JavaScript.

STORE DETAILS:
- Store Name: ${storeName}
- Store Slug: ${storeSlug}
- Category: ${category}
${themeInstructions}

API ENDPOINTS (use these to fetch data):
- GET ${apiBaseUrl}/api/storefront/${storeSlug}/products - Returns array of products
- GET ${apiBaseUrl}/api/storefront/${storeSlug}/store - Returns store info
- POST ${apiBaseUrl}/api/storefront/${storeSlug}/cart - Cart operations (body: { action: 'add'|'remove'|'update', productId, quantity })

REQUIREMENTS:
1. Generate THREE separate files in this exact format:

===FILE: index.html===
[HTML content here]
===END FILE===

===FILE: styles.css===
[CSS content here]
===END FILE===

===FILE: app.js===
[JavaScript content here]
===END FILE===

2. The HTML should include:
   - Header with store name and cart icon with item count
   - Hero section with welcome message
   - Product grid that loads from the API
   - Cart drawer/modal that slides in from the right
   - Footer with store info

3. The CSS should include:
   - CSS variables for theming (use colors from theme above if provided)
   - Responsive design (mobile-first)
   - Modern, clean aesthetic with smooth transitions
   - No gradients - use solid colors only
   - Generous whitespace and professional appearance

4. The JavaScript should include:
   - Fetch products from API on page load
   - Render product cards dynamically
   - Cart functionality (add to cart, update quantity, remove)
   - Store cart in localStorage
   - Cart drawer toggle functionality
   - Loading states while fetching

5. Each product card should display:
   - Product image
   - Product name
   - Price (formatted with currency)
   - Add to cart button

6. The design must be:
   - Mobile responsive
   - Accessible (proper ARIA labels, semantic HTML)
   - Fast loading
   - Professional and polished

Generate the complete code now, starting with index.html:`;
}

function parseGeneratedFiles(response: string): GeneratedFile[] {
    const files: GeneratedFile[] = [];

    // Pattern to match ===FILE: filename=== ... ===END FILE===
    const filePattern = /===FILE:\s*([^=]+)===\s*([\s\S]*?)===END FILE===/g;

    let match;
    while ((match = filePattern.exec(response)) !== null) {
        const fileName = match[1].trim();
        const content = match[2].trim();

        if (fileName && content) {
            files.push({
                name: fileName,
                content: content,
            });
        }
    }

    return files;
}

export class AIGatewayService {
    private apiBaseUrl: string;

    constructor() {
        this.apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.vendlyafrica.store";
    }

    /**
     * Generate a complete storefront using Gemini via AI Gateway
     */
    async generateStorefront(input: StorefrontInput): Promise<GeneratedStorefront> {
        console.log(`[AIGateway] Generating storefront for: ${input.storeName}`);

        const prompt = buildStorefrontPrompt(input, this.apiBaseUrl);

        if (!process.env.AI_GATEWAY_API_KEY) {
            throw new Error("AI_GATEWAY_API_KEY is missing in environment variables");
        }

        try {
            const { text } = await generateText({
                model: gateway.chat("google/gemini-2.5-flash"),
                prompt,
            });

            console.log(`[AIGateway] Received response, parsing files...`);

            const files = parseGeneratedFiles(text);

            if (files.length === 0) {
                console.error(`[AIGateway] No files parsed from response. Raw response length: ${text.length}`);
                throw new Error("Failed to parse generated files from AI response");
            }

            console.log(`[AIGateway] Parsed ${files.length} files: ${files.map(f => f.name).join(", ")}`);

            // Create a combined demo HTML that inlines CSS and JS
            const htmlFile = files.find(f => f.name === "index.html");
            const cssFile = files.find(f => f.name === "styles.css");
            const jsFile = files.find(f => f.name === "app.js");

            let demoHtml = htmlFile?.content || "";

            // Inline CSS if present
            if (cssFile) {
                demoHtml = demoHtml.replace(
                    /<link[^>]*href=["']styles\.css["'][^>]*>/i,
                    `<style>${cssFile.content}</style>`
                );
                // Also handle if there's no link tag, add before </head>
                if (!demoHtml.includes("<style>")) {
                    demoHtml = demoHtml.replace(
                        "</head>",
                        `<style>${cssFile.content}</style></head>`
                    );
                }
            }

            // Inline JS if present
            if (jsFile) {
                demoHtml = demoHtml.replace(
                    /<script[^>]*src=["']app\.js["'][^>]*><\/script>/i,
                    `<script>${jsFile.content}</script>`
                );
                // Also handle if there's no script tag, add before </body>
                if (!demoHtml.includes("<script>") || !demoHtml.includes(jsFile.content)) {
                    demoHtml = demoHtml.replace(
                        "</body>",
                        `<script>${jsFile.content}</script></body>`
                    );
                }
            }

            return {
                files,
                demoHtml,
            };
        } catch (error) {
            console.error(`[AIGateway] Error generating storefront:`, error);
            throw error;
        }
    }
}

export const aiGatewayService = new AIGatewayService();
