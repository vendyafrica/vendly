import { PlasmicStorefrontTemplate, PlasmicStorefrontMinimal } from "@/legacy/plasmic";

export type TemplateName = "standard" | "minimal";

type StorefrontTemplateProps = {
    storeSlug: string;
    heroBackgroundImage?: string;
};

export const TEMPLATES: Record<string, React.ComponentType<StorefrontTemplateProps>> = {
    standard: PlasmicStorefrontTemplate,
    minimal: PlasmicStorefrontMinimal,
    // Add more templates here
    // bold: PlasmicStorefrontBold,
};

export function getTemplate(templateName?: string | null) {
    const name = templateName?.toLowerCase() || "standard";
    return TEMPLATES[name] || TEMPLATES.standard;
}
