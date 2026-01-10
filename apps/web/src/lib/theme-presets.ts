// Theme presets for storefront generation
// Each theme includes CSS variables that will be passed to AI for styling

export type ThemePreset = {
    id: string;
    name: string;
    description: string;
    preview: string[]; // 4 colors for preview
    cssVariables: {
        background: string;
        foreground: string;
        card: string;
        cardForeground: string;
        primary: string;
        primaryForeground: string;
        secondary: string;
        secondaryForeground: string;
        muted: string;
        mutedForeground: string;
        accent: string;
        accentForeground: string;
        border: string;
        input: string;
        ring: string;
        radius: string;
    };
};

export const THEME_PRESETS: ThemePreset[] = [
    {
        id: "old-money",
        name: "Old Money / Heritage",
        description: "Timeless elegance with rich greens, creams, and serif typography.",
        preview: ["#1B4D3E", "#F5F5F0", "#D4AF37", "#0A192F"],
        cssVariables: {
            background: "#F5F5F0",
            foreground: "#0A192F",
            card: "#FFFFFF",
            cardForeground: "#0A192F",
            primary: "#1B4D3E",
            primaryForeground: "#FFFFFF",
            secondary: "#D4AF37",
            secondaryForeground: "#0A192F",
            muted: "#E8E8E0",
            mutedForeground: "#5C6B7F",
            accent: "#D4AF37",
            accentForeground: "#FFFFFF",
            border: "#D1D1C7",
            input: "#FFFFFF",
            ring: "#1B4D3E",
            radius: "0.25rem",
        },
    },
    {
        id: "premium-minimal",
        name: "Premium Minimal",
        description: "Clean, premium feel for luxury goods",
        preview: ["#1a1a1a", "#f5f5f5", "#e5e5e5", "#ffffff"],
        cssVariables: {
            background: "#ffffff",
            foreground: "#1a1a1a",
            card: "#fafafa",
            cardForeground: "#1a1a1a",
            primary: "#1a1a1a",
            primaryForeground: "#ffffff",
            secondary: "#f5f5f5",
            secondaryForeground: "#1a1a1a",
            muted: "#f5f5f5",
            mutedForeground: "#737373",
            accent: "#f5f5f5",
            accentForeground: "#1a1a1a",
            border: "#e5e5e5",
            input: "#e5e5e5",
            ring: "#1a1a1a",
            radius: "0.5rem",
        },
    },
    {
        id: "bold-modern",
        name: "Bold & Modern",
        description: "Loud, energetic for statement pieces",
        preview: ["#000000", "#ff3366", "#ffcc00", "#ffffff"],
        cssVariables: {
            background: "#ffffff",
            foreground: "#000000",
            card: "#ffffff",
            cardForeground: "#000000",
            primary: "#ff3366",
            primaryForeground: "#ffffff",
            secondary: "#000000",
            secondaryForeground: "#ffffff",
            muted: "#f0f0f0",
            mutedForeground: "#666666",
            accent: "#ffcc00",
            accentForeground: "#000000",
            border: "#000000",
            input: "#e0e0e0",
            ring: "#ff3366",
            radius: "0rem",
        },
    },
    {
        id: "soft-feminine",
        name: "Soft Feminine",
        description: "Girly aesthetic for beauty & lifestyle",
        preview: ["#fdf2f4", "#f8b4c0", "#d4a574", "#ffffff"],
        cssVariables: {
            background: "#fffbfc",
            foreground: "#4a3f44",
            card: "#ffffff",
            cardForeground: "#4a3f44",
            primary: "#e8909c",
            primaryForeground: "#ffffff",
            secondary: "#fdf2f4",
            secondaryForeground: "#4a3f44",
            muted: "#fdf2f4",
            mutedForeground: "#8b7e82",
            accent: "#d4a574",
            accentForeground: "#ffffff",
            border: "#f5e1e4",
            input: "#f5e1e4",
            ring: "#e8909c",
            radius: "1rem",
        },
    },
    {
        id: "chill-vibes",
        name: "Chill Vibes",
        description: "Relaxed, earthy for lifestyle brands",
        preview: ["#f5f0eb", "#9caa8c", "#c4a77d", "#3d3d3d"],
        cssVariables: {
            background: "#faf8f5",
            foreground: "#3d3d3d",
            card: "#ffffff",
            cardForeground: "#3d3d3d",
            primary: "#9caa8c",
            primaryForeground: "#ffffff",
            secondary: "#f5f0eb",
            secondaryForeground: "#3d3d3d",
            muted: "#f5f0eb",
            mutedForeground: "#6b6b6b",
            accent: "#c4a77d",
            accentForeground: "#ffffff",
            border: "#e8e2d9",
            input: "#e8e2d9",
            ring: "#9caa8c",
            radius: "0.75rem",
        },
    },
    {
        id: "classic-mono",
        name: "Classic Mono",
        description: "Timeless black & white",
        preview: ["#000000", "#333333", "#666666", "#ffffff"],
        cssVariables: {
            background: "#ffffff",
            foreground: "#000000",
            card: "#ffffff",
            cardForeground: "#000000",
            primary: "#000000",
            primaryForeground: "#ffffff",
            secondary: "#f5f5f5",
            secondaryForeground: "#000000",
            muted: "#f5f5f5",
            mutedForeground: "#666666",
            accent: "#333333",
            accentForeground: "#ffffff",
            border: "#e0e0e0",
            input: "#e0e0e0",
            ring: "#000000",
            radius: "0.375rem",
        },
    },
];

export function getThemeById(id: string): ThemePreset | undefined {
    return THEME_PRESETS.find((t) => t.id === id);
}

export function getDefaultTheme(): ThemePreset {
    return THEME_PRESETS[0];
}
