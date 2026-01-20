// Simplified theme structure - only button styles, fonts, and background colors
export interface ThemeButton {
  backgroundColor: string;
  textColor: string;
  hoverBackgroundColor: string;
  hoverTextColor: string;
  borderRadius: string;
}

export interface ThemeColors {
  background: string;
  textColor: string;
}

export interface ThemeTypography {
  fontFamily: string;
}

export interface StoreTheme {
  id: string;
  name: string;
  colors: ThemeColors;
  typography: ThemeTypography;
  button: ThemeButton;
}

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

export type ThemeVariant = "default" | "glacier" | "harvest" | "lavender" | "brutalist" | "obsidian" | "orchid" | "solar";

export interface ThemeableProps {
  variant?: "default" | "secondary" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  className?: string;
}
