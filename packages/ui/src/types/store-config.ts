export interface ThemeColors {
  // Primary brand colors
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  
  // Background colors
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  
  // Interactive elements
  card: string;
  cardForeground: string;
  border: string;
  input: string;
  ring: string;
  
  // State colors
  destructive: string;
  destructiveForeground: string;
  success: string;
  successForeground: string;
  warning: string;
  warningForeground: string;
}

export interface ThemeTypography {
  fontFamily: "sans" | "serif" | "mono";
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    "2xl": string;
    "3xl": string;
    "4xl": string;
    "5xl": string;
    "6xl": string;
  };
  lineHeight: {
    tight: string;
    snug: string;
    normal: string;
    relaxed: string;
    loose: string;
  };
  letterSpacing: {
    tighter: string;
    tight: string;
    normal: string;
    wide: string;
    wider: string;
    widest: string;
  };
}

export interface ThemeSpacing {
  radius: string;
  shadow: {
    sm: string;
    base: string;
    md: string;
    lg: string;
    xl: string;
    "2xl": string;
  };
}

export interface StoreTheme {
  id: string;
  name: string;
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  customCSS?: string;
}

// Content Configuration Types
export interface StoreHeaderConfig {
  storeName: string;
  navLinks: Array<{
    label: string;
    href: string;
  }>;
  showSearch?: boolean;
  showCart?: boolean;
  showAccount?: boolean;
}

export interface StoreHeroConfig {
  headline: string;
  subheadline: string;
  backgroundImage: string;
  ctaText: string;
  ctaLink: string;
}

export interface StoreCategoriesConfig {
  title: string;
  items: Array<{
    name: string;
    slug: string;
    imageUrl: string;
  }>;
}

export interface StoreFeaturedConfig {
  title: string;
  items: Array<{
    id: string;
    title: string;
    imageUrl: string;
    link: string;
    ctaText: string;
  }>;
}

export interface StoreFooterConfig {
  copyrightText: string;
  links?: Array<{
    title: string;
    items: Array<{
      label: string;
      href: string;
    }>;
  }>;
  socialLinks?: Array<{
    platform: string;
    url: string;
    icon: string;
  }>;
}

export interface StoreContent {
  header: StoreHeaderConfig;
  hero: StoreHeroConfig;
  categories: StoreCategoriesConfig;
  featured: StoreFeaturedConfig;
  footer: StoreFooterConfig;
}

export interface StoreConfiguration {
  id: string;
  name: string;
  domain?: string;
  theme: StoreTheme;
  content: StoreContent;
  createdAt?: Date;
  updatedAt?: Date;
}

// Theme variants - 8 comprehensive schemes
export type ThemeVariant = "default" | "glacier" | "harvest" | "lavender" | "brutalist" | "obsidian" | "orchid" | "solar";

// Component theme props
export interface ThemeableProps {
  variant?: "default" | "secondary" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  className?: string;
}
