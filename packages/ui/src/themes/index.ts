import { StoreTheme, ThemeVariant } from "../types/store-config";

// Base typography and spacing (consistent across all themes)
const baseTypography = {
  fontFamily: "sans" as const,
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem", 
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
    "6xl": "3.75rem",
  },
  lineHeight: {
    tight: "1.25",
    snug: "1.375",
    normal: "1.5",
    relaxed: "1.625",
    loose: "2",
  },
  letterSpacing: {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0em",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em",
  },
};

const baseSpacing = {
  radius: "0.5rem",
  shadow: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    base: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  },
};

// Theme 1: Default - Clean and neutral
const defaultTheme: StoreTheme = {
  id: "default",
  name: "Default",
  colors: {
    primary: "#18181b",
    primaryForeground: "#fafafa",
    secondary: "#f4f4f5",
    secondaryForeground: "#18181b",
    accent: "#f1f5f9",
    accentForeground: "#0f172a",
    
    background: "#ffffff",
    foreground: "#09090b",
    muted: "#f1f5f9",
    mutedForeground: "#64748b",
    
    card: "#ffffff",
    cardForeground: "#09090b",
    border: "#e2e8f0",
    input: "#ffffff",
    ring: "#020617",
    
    destructive: "#ef4444",
    destructiveForeground: "#fef2f2",
    success: "#22c55e",
    successForeground: "#f0fdf4",
    warning: "#f59e0b",
    warningForeground: "#fffbeb",
  },
  typography: baseTypography,
  spacing: baseSpacing,
};

// Theme 2: Glacier - Cool blues and whites
const glacierTheme: StoreTheme = {
  id: "glacier",
  name: "Glacier",
  colors: {
    primary: "#0ea5e9",
    primaryForeground: "#f0f9ff",
    secondary: "#e0f2fe",
    secondaryForeground: "#0c4a6e",
    accent: "#bae6fd",
    accentForeground: "#075985",
    
    background: "#fafbfc",
    foreground: "#0c4a6e",
    muted: "#f0f9ff",
    mutedForeground: "#64748b",
    
    card: "#ffffff",
    cardForeground: "#0c4a6e",
    border: "#bae6fd",
    input: "#ffffff",
    ring: "#0ea5e9",
    
    destructive: "#ef4444",
    destructiveForeground: "#fef2f2",
    success: "#22c55e",
    successForeground: "#f0fdf4",
    warning: "#f59e0b",
    warningForeground: "#fffbeb",
  },
  typography: baseTypography,
  spacing: baseSpacing,
};

// Theme 3: Harvest - Warm oranges and browns
const harvestTheme: StoreTheme = {
  id: "harvest",
  name: "Harvest",
  colors: {
    primary: "#ea580c",
    primaryForeground: "#fff7ed",
    secondary: "#fed7aa",
    secondaryForeground: "#9a3412",
    accent: "#ffedd5",
    accentForeground: "#c2410c",
    
    background: "#fffbf5",
    foreground: "#9a3412",
    muted: "#fff7ed",
    mutedForeground: "#a16207",
    
    card: "#ffffff",
    cardForeground: "#9a3412",
    border: "#fed7aa",
    input: "#ffffff",
    ring: "#ea580c",
    
    destructive: "#ef4444",
    destructiveForeground: "#fef2f2",
    success: "#22c55e",
    successForeground: "#f0fdf4",
    warning: "#f59e0b",
    warningForeground: "#fffbeb",
  },
  typography: baseTypography,
  spacing: baseSpacing,
};

// Theme 4: Lavender - Soft purples
const lavenderTheme: StoreTheme = {
  id: "lavender",
  name: "Lavender",
  colors: {
    primary: "#a855f7",
    primaryForeground: "#faf5ff",
    secondary: "#e9d5ff",
    secondaryForeground: "#6b21a8",
    accent: "#f3e8ff",
    accentForeground: "#7c3aed",
    
    background: "#fefbff",
    foreground: "#581c87",
    muted: "#faf5ff",
    mutedForeground: "#7c2d92",
    
    card: "#ffffff",
    cardForeground: "#581c87",
    border: "#e9d5ff",
    input: "#ffffff",
    ring: "#a855f7",
    
    destructive: "#ef4444",
    destructiveForeground: "#fef2f2",
    success: "#22c55e",
    successForeground: "#f0fdf4",
    warning: "#f59e0b",
    warningForeground: "#fffbeb",
  },
  typography: baseTypography,
  spacing: baseSpacing,
};

// Theme 5: Brutalist - Bold black and white contrast
const brutalistTheme: StoreTheme = {
  id: "brutalist",
  name: "Brutalist",
  colors: {
    primary: "#000000",
    primaryForeground: "#ffffff",
    secondary: "#fafafa",
    secondaryForeground: "#000000",
    accent: "#e4e4e7",
    accentForeground: "#18181b",
    
    background: "#ffffff",
    foreground: "#000000",
    muted: "#f4f4f5",
    mutedForeground: "#52525b",
    
    card: "#ffffff",
    cardForeground: "#000000",
    border: "#000000",
    input: "#ffffff",
    ring: "#000000",
    
    destructive: "#dc2626",
    destructiveForeground: "#ffffff",
    success: "#16a34a",
    successForeground: "#ffffff",
    warning: "#ca8a04",
    warningForeground: "#ffffff",
  },
  typography: baseTypography,
  spacing: baseSpacing,
};

// Theme 6: Obsidian - Dark and mysterious
const obsidianTheme: StoreTheme = {
  id: "obsidian",
  name: "Obsidian",
  colors: {
    primary: "#64748b",
    primaryForeground: "#f1f5f9",
    secondary: "#334155",
    secondaryForeground: "#cbd5e1",
    accent: "#475569",
    accentForeground: "#e2e8f0",
    
    background: "#0f172a",
    foreground: "#f1f5f9",
    muted: "#1e293b",
    mutedForeground: "#94a3b8",
    
    card: "#1e293b",
    cardForeground: "#f1f5f9",
    border: "#334155",
    input: "#1e293b",
    ring: "#64748b",
    
    destructive: "#ef4444",
    destructiveForeground: "#fef2f2",
    success: "#22c55e",
    successForeground: "#f0fdf4",
    warning: "#f59e0b",
    warningForeground: "#fffbeb",
  },
  typography: baseTypography,
  spacing: baseSpacing,
};

// Theme 7: Orchid - Vibrant pinks and magentas
const orchidTheme: StoreTheme = {
  id: "orchid",
  name: "Orchid",
  colors: {
    primary: "#ec4899",
    primaryForeground: "#fdf2f8",
    secondary: "#fce7f3",
    secondaryForeground: "#be185d",
    accent: "#fbcfe8",
    accentForeground: "#db2777",
    
    background: "#fefbff",
    foreground: "#9d174d",
    muted: "#fdf2f8",
    mutedForeground: "#be185d",
    
    card: "#ffffff",
    cardForeground: "#9d174d",
    border: "#fce7f3",
    input: "#ffffff",
    ring: "#ec4899",
    
    destructive: "#ef4444",
    destructiveForeground: "#fef2f2",
    success: "#22c55e",
    successForeground: "#f0fdf4",
    warning: "#f59e0b",
    warningForeground: "#fffbeb",
  },
  typography: baseTypography,
  spacing: baseSpacing,
};

// Theme 8: Solar - Bright yellows and golds
const solarTheme: StoreTheme = {
  id: "solar",
  name: "Solar",
  colors: {
    primary: "#eab308",
    primaryForeground: "#fefce8",
    secondary: "#fef3c7",
    secondaryForeground: "#a16207",
    accent: "#fde68a",
    accentForeground: "#ca8a04",
    
    background: "#fffef7",
    foreground: "#854d0e",
    muted: "#fefce8",
    mutedForeground: "#a16207",
    
    card: "#ffffff",
    cardForeground: "#854d0e",
    border: "#fef3c7",
    input: "#ffffff",
    ring: "#eab308",
    
    destructive: "#ef4444",
    destructiveForeground: "#fef2f2",
    success: "#22c55e",
    successForeground: "#f0fdf4",
    warning: "#f59e0b",
    warningForeground: "#fffbeb",
  },
  typography: baseTypography,
  spacing: baseSpacing,
};

// Theme registry
export const themes = {
  default: defaultTheme,
  glacier: glacierTheme,
  harvest: harvestTheme,
  lavender: lavenderTheme,
  brutalist: brutalistTheme,
  obsidian: obsidianTheme,
  orchid: orchidTheme,
  solar: solarTheme,
} as const;

export const getTheme = (variant: ThemeVariant): StoreTheme => {
  return themes[variant];
};

export const getThemeVariables = (theme: StoreTheme): Record<string, string> => {
  return {
    // Colors
    "--color-primary": theme.colors.primary,
    "--color-primary-foreground": theme.colors.primaryForeground,
    "--color-secondary": theme.colors.secondary,
    "--color-secondary-foreground": theme.colors.secondaryForeground,
    "--color-accent": theme.colors.accent,
    "--color-accent-foreground": theme.colors.accentForeground,
    "--color-background": theme.colors.background,
    "--color-foreground": theme.colors.foreground,
    "--color-muted": theme.colors.muted,
    "--color-muted-foreground": theme.colors.mutedForeground,
    "--color-card": theme.colors.card,
    "--color-card-foreground": theme.colors.cardForeground,
    "--color-border": theme.colors.border,
    "--color-input": theme.colors.input,
    "--color-ring": theme.colors.ring,
    "--color-destructive": theme.colors.destructive,
    "--color-destructive-foreground": theme.colors.destructiveForeground,
    "--color-success": theme.colors.success,
    "--color-success-foreground": theme.colors.successForeground,
    "--color-warning": theme.colors.warning,
    "--color-warning-foreground": theme.colors.warningForeground,
    
    // Typography
    "--font-family": theme.typography.fontFamily === "sans" ? "system-ui, -apple-system, sans-serif" :
                     theme.typography.fontFamily === "serif" ? "Georgia, serif" : 
                     "ui-monospace, monospace",
    
    // Spacing
    "--radius": theme.spacing.radius,
  };
};

export type { StoreTheme, ThemeVariant };
export { defaultTheme, glacierTheme, harvestTheme, lavenderTheme, brutalistTheme, obsidianTheme, orchidTheme, solarTheme };
