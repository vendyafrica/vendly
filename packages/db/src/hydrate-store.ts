
import { db } from "./db";
import {
    stores,
    templates,
    storeThemes,
    storeContent,
    storeNavigation,
    storePages
} from "./schema/index";
import { eq } from "drizzle-orm";

async function verifyAndHydrate() {
    const TARGET_STORE_SLUG = "sents";
    const TEMPLATE_SLUG = "old-money";

    console.log(`Hydrating store '${TARGET_STORE_SLUG}' from template '${TEMPLATE_SLUG}'...`);

    // 1. Fetch Store
    const store = await db.query.stores.findFirst({
        where: eq(stores.slug, TARGET_STORE_SLUG),
        with: {
            tenant: true
        }
    });

    if (!store) {
        console.error(`Store '${TARGET_STORE_SLUG}' not found!`);
        process.exit(1);
    }
    console.log(`Found store: ${store.name} (${store.id})`);

    // 2. Fetch Template
    const template = await db.query.templates.findFirst({
        where: eq(templates.slug, TEMPLATE_SLUG)
    });

    if (!template) {
        console.error(`Template '${TEMPLATE_SLUG}' not found!`);
        process.exit(1);
    }
    console.log(`Found template: ${template.name}`);

    // 3. Hydrate Store Themes
    console.log("Hydrating Store Themes...");
    if (template.themeConfig) {
        const { colors, typography, layout, components, customCss } = template.themeConfig;

        await db.insert(storeThemes)
            .values({
                tenantId: store.tenantId,
                storeId: store.id,
                templateId: template.id,
                colors,
                typography,
                layout,
                components,
                customCss,
                preset: "minimal" // Default fallback
            })
            .onConflictDoUpdate({
                target: storeThemes.storeId,
                set: {
                    colors,
                    typography,
                    layout,
                    components,
                    customCss,
                    updatedAt: new Date()
                }
            });
    }

    // 4. Hydrate Store Content
    console.log("Hydrating Store Content...");
    if (template.contentConfig) {
        const { hero, sections, footer } = template.contentConfig;

        await db.insert(storeContent)
            .values({
                tenantId: store.tenantId,
                storeId: store.id,
                hero,
                sections,
                footer: {
                    ...footer,
                    // Ensure required fields
                    copyright: footer.copyright || `© ${new Date().getFullYear()} ${store.name}`,
                    description: footer.description || store.description || "",
                    showSocialLinks: footer.showSocialLinks ?? true,
                    showNewsletter: footer.showNewsletter ?? true
                }
            })
            .onConflictDoUpdate({
                target: storeContent.storeId,
                set: {
                    hero,
                    sections,
                    footer,
                    updatedAt: new Date()
                }
            });
    }

    // 5. Hydrate Navigation
    console.log("Hydrating Store Navigation...");
    if (template.navigationConfig && Array.isArray(template.navigationConfig)) {
        // Clear existing to avoid dupes (simple approach for now)
        await db.delete(storeNavigation).where(eq(storeNavigation.storeId, store.id));

        for (const nav of template.navigationConfig) {
            await db.insert(storeNavigation).values({
                tenantId: store.tenantId,
                storeId: store.id,
                name: nav.name,
                position: nav.position,
                items: nav.items,
                isActive: true
            });
        }
    }

    // 6. Hydrate Pages
    console.log("Hydrating Store Pages...");
    if (template.pagesConfig && Array.isArray(template.pagesConfig)) {
        // Clear existing
        await db.delete(storePages).where(eq(storePages.storeId, store.id));

        for (const page of template.pagesConfig) {
            await db.insert(storePages).values({
                tenantId: store.tenantId,
                storeId: store.id,
                title: page.title,
                slug: page.slug,
                content: page.content,
                isPublished: page.isPublished ?? true,
                showInMenu: page.showInMenu ?? false
            });
        }
    }

    console.log("Hydration Complete!");
    process.exit(0);
}

verifyAndHydrate().catch(e => {
    console.error(e);
    process.exit(1);
});
