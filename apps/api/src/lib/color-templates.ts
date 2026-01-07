// Color templates for store customization
export const colorTemplates = {
    dark: {
        primary: "#1a1a2e",
        secondary: "#4a6fa5",
        accent: "#ffffff",
        background: "#0f0f0f",
        text: "#ffffff",
        name: "Dark",
    },
    light: {
        primary: "#1a1a2e",
        secondary: "#f5f5f5",
        accent: "#1a1a2e",
        background: "#ffffff",
        text: "#1a1a2e",
        name: "Light",
    },
    warm: {
        primary: "#8B4513",
        secondary: "#DEB887",
        accent: "#ffffff",
        background: "#FAF0E6",
        text: "#3d2914",
        name: "Warm",
    },
    cool: {
        primary: "#2c3e50",
        secondary: "#3498db",
        accent: "#ffffff",
        background: "#ecf0f1",
        text: "#2c3e50",
        name: "Cool",
    },
    vibrant: {
        primary: "#e74c3c",
        secondary: "#f39c12",
        accent: "#ffffff",
        background: "#ffffff",
        text: "#2c3e50",
        name: "Vibrant",
    },
} as const;

export type ColorTemplateName = keyof typeof colorTemplates;
export type ColorTemplate = typeof colorTemplates[ColorTemplateName];

export function getColorTemplate(name: ColorTemplateName): ColorTemplate {
    return colorTemplates[name] || colorTemplates.dark;
}
