import { StoreTheme, ThemeVariant } from "../types/store-config";

const defaultTheme: StoreTheme = {
  id: "default",
  name: "Default",
  colors: {
    background: "#ffffff",
    textColor: "#1a1a1a",
  },
  typography: {
    fontFamily: "Inter, system-ui, -apple-system, sans-serif",
  },
  button: {
    backgroundColor: "#1a1a1a",
    textColor: "#ffffff",
    hoverBackgroundColor: "#333333",
    hoverTextColor: "#ffffff",
    borderRadius: "0.5rem",
  },
};

const glacierTheme: StoreTheme = {
  id: "glacier",
  name: "Glacier",
  colors: {
    background: "#fafbfc",
    textColor: "#0c4a6e",
  },
  typography: {
    fontFamily: "Roboto, system-ui, -apple-system, sans-serif",
  },
  button: {
    backgroundColor: "#0ea5e9",
    textColor: "#ffffff",
    hoverBackgroundColor: "#0284c7",
    hoverTextColor: "#ffffff",
    borderRadius: "0.375rem",
  },
};

const harvestTheme: StoreTheme = {
  id: "harvest",
  name: "Harvest",
  colors: {
    background: "#fffbf5",
    textColor: "#9a3412",
  },
  typography: {
    fontFamily: "Merriweather, Georgia, serif",
  },
  button: {
    backgroundColor: "#ea580c",
    textColor: "#ffffff",
    hoverBackgroundColor: "#dc2626",
    hoverTextColor: "#ffffff",
    borderRadius: "0.25rem",
  },
};

const lavenderTheme: StoreTheme = {
  id: "lavender",
  name: "Lavender",
  colors: {
    background: "#fefbff",
    textColor: "#581c87",
  },
  typography: {
    fontFamily: "Poppins, system-ui, -apple-system, sans-serif",
  },
  button: {
    backgroundColor: "#a855f7",
    textColor: "#ffffff",
    hoverBackgroundColor: "#9333ea",
    hoverTextColor: "#ffffff",
    borderRadius: "1rem",
  },
};

const brutalistTheme: StoreTheme = {
  id: "brutalist",
  name: "Brutalist",
  colors: {
    background: "#ffffff",
    textColor: "#000000",
  },
  typography: {
    fontFamily: "JetBrains Mono, Monaco, 'Courier New', monospace",
  },
  button: {
    backgroundColor: "#000000",
    textColor: "#ffffff",
    hoverBackgroundColor: "#18181b",
    hoverTextColor: "#ffffff",
    borderRadius: "0px",
  },
};

const obsidianTheme: StoreTheme = {
  id: "obsidian",
  name: "Obsidian",
  colors: {
    background: "#0f172a",
    textColor: "#f1f5f9",
  },
  typography: {
    fontFamily: "Source Sans Pro, system-ui, -apple-system, sans-serif",
  },
  button: {
    backgroundColor: "#64748b",
    textColor: "#f1f5f9",
    hoverBackgroundColor: "#475569",
    hoverTextColor: "#ffffff",
    borderRadius: "0.375rem",
  },
};

const orchidTheme: StoreTheme = {
  id: "orchid",
  name: "Orchid",
  colors: {
    background: "#fefbff",
    textColor: "#9d174d",
  },
  typography: {
    fontFamily: "Playfair Display, Georgia, serif",
  },
  button: {
    backgroundColor: "#ec4899",
    textColor: "#ffffff",
    hoverBackgroundColor: "#db2777",
    hoverTextColor: "#ffffff",
    borderRadius: "0.75rem",
  },
};

const solarTheme: StoreTheme = {
  id: "solar",
  name: "Solar",
  colors: {
    background: "#fffef7",
    textColor: "#854d0e",
  },
  typography: {
    fontFamily: "Montserrat, system-ui, -apple-system, sans-serif",
  },
  button: {
    backgroundColor: "#eab308",
    textColor: "#ffffff",
    hoverBackgroundColor: "#ca8a04",
    hoverTextColor: "#ffffff",
    borderRadius: "0.5rem",
  },
};

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
    "--color-background": theme.colors.background,
    "--color-text": theme.colors.textColor,
    
    "--font-family": theme.typography.fontFamily,
    
    "--button-bg": theme.button.backgroundColor,
    "--button-text": theme.button.textColor,
    "--button-hover-bg": theme.button.hoverBackgroundColor,
    "--button-hover-text": theme.button.hoverTextColor,
    "--button-radius": theme.button.borderRadius,
  };
};

export type { StoreTheme, ThemeVariant };
export { defaultTheme, glacierTheme, harvestTheme, lavenderTheme, brutalistTheme, obsidianTheme, orchidTheme, solarTheme };
