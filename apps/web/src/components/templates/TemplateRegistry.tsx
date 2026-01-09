import { PlasmicStorefrontTemplate } from "../plasmic/PlasmicStorefrontTemplate";
import { PlasmicStorefrontMinimal } from "./PlasmicStorefrontMinimal";

export type TemplateName = "standard" | "minimal";

export const TEMPLATES: Record<string, React.ComponentType<any>> = {
    standard: PlasmicStorefrontTemplate,
    minimal: PlasmicStorefrontMinimal,
    // Add more templates here
    // bold: PlasmicStorefrontBold,
};

export function getTemplate(templateName?: string | null) {
    const name = templateName?.toLowerCase() || "standard";
    return TEMPLATES[name] || TEMPLATES.standard;
}
