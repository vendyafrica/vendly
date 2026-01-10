import { config } from "dotenv";
import path from "path";
import { sql } from "drizzle-orm";
import { templates } from "./schema/storefront-schema";

// Load env vars BEFORE importing db
const rootEnvPath = path.resolve(process.cwd(), "../../.env");
config({ path: rootEnvPath });

if (!process.env.DATABASE_URL) {
    const localEnvPath = path.resolve(process.cwd(), ".env");
    config({ path: localEnvPath });
}

if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL is not defined in environment variables");
    process.exit(1);
}

// Template Data
const TEMPLATES = [
    {
        name: "Old Money / Heritage",
        slug: "old-money",
        description: "Timeless elegance with rich greens, creams, and serif typography. Perfect for luxury and heritage brands.",
        thumbnailUrl: "/templates/old-money.png",
        previewColors: ["#1B4D3E", "#F5F5F0", "#D4AF37", "#0A192F"], // Forest Green, Cream, Gold, Navy

        // 1. Theme Config
        themeConfig: {
            colors: {
                background: "#F5F5F0", // Cream/Off-white
                foreground: "#0A192F", // Deep Navy/Black
                card: "#FFFFFF",
                cardForeground: "#0A192F",
                primary: "#1B4D3E", // Forest Green
                primaryForeground: "#FFFFFF",
                secondary: "#D4AF37", // Muted Gold
                secondaryForeground: "#0A192F",
                muted: "#E8E8E0",
                mutedForeground: "#5C6B7F",
                accent: "#D4AF37",
                accentForeground: "#FFFFFF",
                border: "#D1D1C7",
                input: "#FFFFFF",
                ring: "#1B4D3E",
                radius: "0.25rem", // Slightly squared for classic feel
            },
            typography: {
                fontFamily: "var(--font-serif)", // Simplified for now, mapped in frontend
                headingFont: "Playfair Display",
                bodyFont: "Lato",
            },
            layout: {
                containerWidth: "normal",
                headerStyle: "centered", // Classic centered logo
                buttonStyle: "solid",
            },
        },

        // 2. Content Config
        contentConfig: {
            hero: {
                enabled: true,
                layout: "centered",
                title: "Timeless Elegance",
                subtitle: "Curated collection of heritage pieces for the modern connoisseur.",
                ctaText: "Discover the Collection",
                imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop", // Placeholder
                backgroundOverlay: true,
            },
            sections: [
                {
                    id: "featured-collection",
                    type: "products",
                    title: "The Signature Collection",
                    enabled: true,
                    settings: {
                        layout: "grid",
                        columns: 3,
                        showPrices: true,
                    },
                },
                {
                    id: "brand-story",
                    type: "custom",
                    title: "Our Heritage",
                    enabled: true,
                    content: {
                        html: "<div class='text-center max-w-2xl mx-auto'><p class='text-lg serif italic'>Established in 2024, our brand represents the pinnacle of craftsmanship and timeless style.</p></div>"
                    }
                },
                {
                    id: "journal-preview",
                    type: "banner",
                    title: "Read Our Journal",
                    enabled: true,
                    settings: {
                        layout: "split",
                    }
                }
            ],
            footer: {
                description: "Purveyors of fine goods since 2024.",
                showSocialLinks: true,
                showNewsletter: true,
                newsletterTitle: "Join the Club",
                copyright: "© 2024 Heritage Brand. All rights reserved.",
            },
        },

        // 3. Navigation Config
        navigationConfig: [
            {
                name: "Main Menu",
                position: "header",
                items: [
                    { label: "Shop", url: "/shop", type: "category" },
                    { label: "New Arrivals", url: "/shop/new", type: "category" },
                    { label: "About", url: "/pages/about", type: "page" },
                    { label: "Journal", url: "/blog", type: "link" },
                ],
            },
            {
                name: "Footer Menu",
                position: "footer",
                items: [
                    { label: "Search", url: "/search", type: "link" },
                    { label: "Terms of Service", url: "/pages/terms", type: "page" },
                    { label: "Privacy Policy", url: "/pages/privacy", type: "page" },
                    { label: "Contact", url: "/pages/contact", type: "page" },
                ],
            }
        ],

        // 4. Pages Config
        pagesConfig: [
            {
                title: "About Us",
                slug: "about",
                isPublished: true,
                showInMenu: true,
                content: `
                    <div class="prose max-w-none">
                        <h2 class="font-serif text-3xl mb-6">Our Story</h2>
                        <p class="mb-4">Founded on the principles of quality, integrity, and timeless design, we strive to bring you products that last a lifetime.</p>
                        <p>We believe in slow fashion, conscious consumption, and the beauty of well-made things.</p>
                    </div>
                `,
            },
            {
                title: "Contact",
                slug: "contact",
                isPublished: true,
                showInMenu: true,
                content: `
                    <div class="prose max-w-none">
                        <h2 class="font-serif text-3xl mb-6">Get in Touch</h2>
                        <p>Email: concierge@heritagebrand.com</p>
                        <p>Phone: +1 (555) 123-4567</p>
                        <p>Address: 123 Luxury Lane, Beverly Hills, CA 90210</p>
                    </div>
                `,
            }
        ],
    },
];

async function seed() {
    console.log("🌱 Seeding templates...");

    try {
        const { db } = await import("./db");

        // Ensure table exists and has correct columns (Workaround for broken db:push)
        console.log("Checking schema...");
        await db.execute(sql`
            CREATE TABLE IF NOT EXISTS templates (
                id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                name text NOT NULL,
                slug text NOT NULL UNIQUE,
                description text,
                thumbnail_url text,
                preview_colors jsonb,
                theme_config jsonb,
                content_config jsonb,
                navigation_config jsonb,
                pages_config jsonb,
                is_active boolean DEFAULT true NOT NULL,
                created_at timestamp DEFAULT now() NOT NULL,
                updated_at timestamp DEFAULT now() NOT NULL
            );
        `);

        // Add columns if they don't exist (if table existed but was old version)
        await db.execute(sql`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='templates' AND column_name='theme_config') THEN
                    ALTER TABLE templates ADD COLUMN theme_config jsonb;
                END IF;
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='templates' AND column_name='content_config') THEN
                    ALTER TABLE templates ADD COLUMN content_config jsonb;
                END IF;
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='templates' AND column_name='navigation_config') THEN
                    ALTER TABLE templates ADD COLUMN navigation_config jsonb;
                END IF;
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='templates' AND column_name='pages_config') THEN
                    ALTER TABLE templates ADD COLUMN pages_config jsonb;
                END IF;
            END $$;
        `);

        console.log("Schema verified. Inserting data...");

        for (const tmpl of TEMPLATES) {
            console.log(`Processing template: ${tmpl.name}`);

            await db.insert(templates)
                .values(tmpl as any)
                .onConflictDoUpdate({
                    target: templates.slug,
                    set: tmpl as any
                });
        }
        console.log("✅ Templates seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding templates:", error);
        process.exit(1);
    }
}

seed();
