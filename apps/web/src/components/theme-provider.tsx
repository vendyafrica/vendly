"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

export interface ThemeColors {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  card: string;
  cardForeground: string;
  border: string;
  input: string;
  ring: string;
  destructive: string;
  destructiveForeground: string;
  success: string;
  successForeground: string;
  warning: string;
  warningForeground: string;
}

export interface StoreTheme {
  id: string;
  name: string;
  colors: ThemeColors;
}

export type ThemeVariant =
  | "default"
  | "glacier"
  | "harvest"
  | "lavender"
  | "brutalist"
  | "obsidian"
  | "orchid"
  | "solar"
  | "minimal"
  | "warm"
  | "cool";

interface ThemeContextType {
  theme: StoreTheme;
  variant: ThemeVariant;
  setTheme: (variant: ThemeVariant) => void;
  applyTheme: (theme: StoreTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme definitions
const themes: Record<ThemeVariant, StoreTheme> = {
  minimal: {
    id: "minimal",
    name: "Minimal",
    colors: {
      primary: "#0f172a",
      primaryForeground: "#ffffff",
      secondary: "#f8fafc",
      secondaryForeground: "#0f172a",
      accent: "#e2e8f0",
      accentForeground: "#0f172a",
      background: "#ffffff",
      foreground: "#0f172a",
      muted: "#f8fafc",
      mutedForeground: "#475569",
      card: "#ffffff",
      cardForeground: "#0f172a",
      border: "#e2e8f0",
      input: "#ffffff",
      ring: "#0f172a",
      destructive: "#dc2626",
      destructiveForeground: "#ffffff",
      success: "#16a34a",
      successForeground: "#ffffff",
      warning: "#d97706",
      warningForeground: "#ffffff",
    },
  },
  warm: {
    id: "warm",
    name: "Warm",
    colors: {
      primary: "#b45309",
      primaryForeground: "#ffffff",
      secondary: "#fff7ed",
      secondaryForeground: "#7c2d12",
      accent: "#fed7aa",
      accentForeground: "#7c2d12",
      background: "#fffbf7",
      foreground: "#431407",
      muted: "#fff7ed",
      mutedForeground: "#9a3412",
      card: "#ffffff",
      cardForeground: "#431407",
      border: "#fbbf24",
      input: "#ffffff",
      ring: "#b45309",
      destructive: "#dc2626",
      destructiveForeground: "#ffffff",
      success: "#16a34a",
      successForeground: "#ffffff",
      warning: "#d97706",
      warningForeground: "#ffffff",
    },
  },
  cool: {
    id: "cool",
    name: "Cool",
    colors: {
      primary: "#0ea5e9",
      primaryForeground: "#ffffff",
      secondary: "#f0f9ff",
      secondaryForeground: "#0f172a",
      accent: "#e0f2fe",
      accentForeground: "#0f172a",
      background: "#ffffff",
      foreground: "#0f172a",
      muted: "#f8fafc",
      mutedForeground: "#1e293b",
      card: "#ffffff",
      cardForeground: "#0f172a",
      border: "#cbd5e1",
      input: "#ffffff",
      ring: "#0ea5e9",
      destructive: "#dc2626",
      destructiveForeground: "#ffffff",
      success: "#16a34a",
      successForeground: "#ffffff",
      warning: "#d97706",
      warningForeground: "#ffffff",
    },
  },
  default: {
    id: "default",
    name: "Default",
    colors: {
      primary: "#71717a",
      primaryForeground: "#ffffff",
      secondary: "#f4f4f5",
      secondaryForeground: "#18181b",
      accent: "#f4f4f5",
      accentForeground: "#18181b",
      background: "#ffffff",
      foreground: "#18181b",
      muted: "#f4f4f5",
      mutedForeground: "#71717a",
      card: "#ffffff",
      cardForeground: "#18181b",
      border: "#e4e4e7",
      input: "#ffffff",
      ring: "#71717a",
      destructive: "#dc2626",
      destructiveForeground: "#ffffff",
      success: "#059669",
      successForeground: "#ffffff",
      warning: "#d97706",
      warningForeground: "#ffffff",
    },
  },
  glacier: {
    id: "glacier",
    name: "Glacier",
    colors: {
      primary: "#0ea5e9",
      primaryForeground: "#ffffff",
      secondary: "#f0f9ff",
      secondaryForeground: "#0c4a6e",
      accent: "#e0f2fe",
      accentForeground: "#075985",
      background: "#ffffff",
      foreground: "#0c4a6e",
      muted: "#f0f9ff",
      mutedForeground: "#0369a1",
      card: "#ffffff",
      cardForeground: "#0c4a6e",
      border: "#bae6fd",
      input: "#ffffff",
      ring: "#0ea5e9",
      destructive: "#dc2626",
      destructiveForeground: "#ffffff",
      success: "#059669",
      successForeground: "#ffffff",
      warning: "#d97706",
      warningForeground: "#ffffff",
    },
  },
  harvest: {
    id: "harvest",
    name: "Harvest",
    colors: {
      primary: "#ea580c",
      primaryForeground: "#ffffff",
      secondary: "#fff7ed",
      secondaryForeground: "#9a3412",
      accent: "#fed7aa",
      accentForeground: "#c2410c",
      background: "#fffbf7",
      foreground: "#431407",
      muted: "#fff7ed",
      mutedForeground: "#9a3412",
      card: "#ffffff",
      cardForeground: "#431407",
      border: "#fdba74",
      input: "#ffffff",
      ring: "#ea580c",
      destructive: "#dc2626",
      destructiveForeground: "#ffffff",
      success: "#059669",
      successForeground: "#ffffff",
      warning: "#d97706",
      warningForeground: "#ffffff",
    },
  },
  lavender: {
    id: "lavender",
    name: "Lavender",
    colors: {
      primary: "#a855f7",
      primaryForeground: "#ffffff",
      secondary: "#faf5ff",
      secondaryForeground: "#581c87",
      accent: "#e9d5ff",
      accentForeground: "#7c3aed",
      background: "#fefcff",
      foreground: "#3b0764",
      muted: "#f3e8ff",
      mutedForeground: "#6b21a8",
      card: "#ffffff",
      cardForeground: "#3b0764",
      border: "#d8b4fe",
      input: "#ffffff",
      ring: "#a855f7",
      destructive: "#dc2626",
      destructiveForeground: "#ffffff",
      success: "#059669",
      successForeground: "#ffffff",
      warning: "#d97706",
      warningForeground: "#ffffff",
    },
  },
  brutalist: {
    id: "brutalist",
    name: "Brutalist",
    colors: {
      primary: "#000000",
      primaryForeground: "#ffffff",
      secondary: "#f4f4f4",
      secondaryForeground: "#000000",
      accent: "#e5e5e5",
      accentForeground: "#000000",
      background: "#ffffff",
      foreground: "#000000",
      muted: "#f9f9f9",
      mutedForeground: "#525252",
      card: "#ffffff",
      cardForeground: "#000000",
      border: "#000000",
      input: "#ffffff",
      ring: "#000000",
      destructive: "#dc2626",
      destructiveForeground: "#ffffff",
      success: "#059669",
      successForeground: "#ffffff",
      warning: "#d97706",
      warningForeground: "#ffffff",
    },
  },
  obsidian: {
    id: "obsidian",
    name: "Obsidian",
    colors: {
      primary: "#64748b",
      primaryForeground: "#f8fafc",
      secondary: "#1e293b",
      secondaryForeground: "#e2e8f0",
      accent: "#334155",
      accentForeground: "#f1f5f9",
      background: "#0f172a",
      foreground: "#f8fafc",
      muted: "#1e293b",
      mutedForeground: "#94a3b8",
      card: "#0f172a",
      cardForeground: "#f8fafc",
      border: "#334155",
      input: "#1e293b",
      ring: "#64748b",
      destructive: "#dc2626",
      destructiveForeground: "#ffffff",
      success: "#059669",
      successForeground: "#ffffff",
      warning: "#d97706",
      warningForeground: "#ffffff",
    },
  },
  orchid: {
    id: "orchid",
    name: "Orchid",
    colors: {
      primary: "#ec4899",
      primaryForeground: "#ffffff",
      secondary: "#fdf2f8",
      secondaryForeground: "#831843",
      accent: "#f9a8d4",
      accentForeground: "#be185d",
      background: "#fffafc",
      foreground: "#500724",
      muted: "#fce7f3",
      mutedForeground: "#9d174d",
      card: "#ffffff",
      cardForeground: "#500724",
      border: "#f472b6",
      input: "#ffffff",
      ring: "#ec4899",
      destructive: "#dc2626",
      destructiveForeground: "#ffffff",
      success: "#059669",
      successForeground: "#ffffff",
      warning: "#d97706",
      warningForeground: "#ffffff",
    },
  },
  solar: {
    id: "solar",
    name: "Solar",
    colors: {
      primary: "#eab308",
      primaryForeground: "#422006",
      secondary: "#fffbeb",
      secondaryForeground: "#78350f",
      accent: "#fed7aa",
      accentForeground: "#a16207",
      background: "#fffdf5",
      foreground: "#451a03",
      muted: "#fefce8",
      mutedForeground: "#854d0e",
      card: "#ffffff",
      cardForeground: "#451a03",
      border: "#fbbf24",
      input: "#ffffff",
      ring: "#eab308",
      destructive: "#dc2626",
      destructiveForeground: "#ffffff",
      success: "#059669",
      successForeground: "#ffffff",
      warning: "#d97706",
      warningForeground: "#ffffff",
    },
  },
};

const getTheme = (variant: ThemeVariant): StoreTheme => themes[variant];

const getThemeVariables = (theme: StoreTheme): Record<string, string> => {
  return {
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
    "--radius": "0.5rem",
    "--shadow-sm": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    "--shadow-base": "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    "--shadow-md": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    "--shadow-lg": "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  };
};

interface StoreThemeProviderProps {
  children: React.ReactNode;
  config?: StoreTheme;
  defaultVariant?: ThemeVariant;
  storeId?: string;
}

export function StoreThemeProvider({ 
  children, 
  config, 
  defaultVariant = "default",
  storeId 
}: StoreThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<StoreTheme>(
    config || getTheme(defaultVariant)
  );
  const [currentVariant, setCurrentVariant] = useState<ThemeVariant>(
    config?.id as ThemeVariant || defaultVariant
  );

  const applyThemeVariables = useCallback((theme: StoreTheme) => {
    const variables = getThemeVariables(theme);
    
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      Object.entries(variables).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
    }
  }, []);

  const setTheme = useCallback((variant: ThemeVariant) => {
    const newTheme = getTheme(variant);
    setCurrentTheme(newTheme);
    setCurrentVariant(variant);
    applyThemeVariables(newTheme);
    
    if (storeId && typeof window !== "undefined") {
      localStorage.setItem(`vendly-theme-${storeId}`, variant);
    }
  }, [applyThemeVariables, storeId]);

  const applyTheme = useCallback((theme: StoreTheme) => {
    setCurrentTheme(theme);
    setCurrentVariant(theme.id as ThemeVariant);
    applyThemeVariables(theme);
  }, [applyThemeVariables]);

  useEffect(() => {
    if (storeId && typeof window !== "undefined") {
      const persistedTheme = localStorage.getItem(`vendly-theme-${storeId}`) as ThemeVariant;
      if (persistedTheme && themes[persistedTheme]) {
        setTheme(persistedTheme);
        return;
      }
    }
    
    applyThemeVariables(currentTheme);
  }, [storeId, currentTheme, setTheme, applyThemeVariables]);

  useEffect(() => {
    if (config) {
      applyTheme(config);
    }
  }, [config, applyTheme]);

  const contextValue: ThemeContextType = {
    theme: currentTheme,
    variant: currentVariant,
    setTheme,
    applyTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <div 
        className="theme-root"
        data-theme={currentVariant}
        data-store={storeId}
        style={{
          colorScheme: currentTheme.colors.background === "#ffffff" ? "light" : "dark",
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a StoreThemeProvider");
  }
  return context;
}

export { themes, getTheme, getThemeVariables };
