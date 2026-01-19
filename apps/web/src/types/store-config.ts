import { ThemeVariant } from "../components/theme-provider";

// Store Configuration Types for Web App
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
  themeVariant: ThemeVariant;
  content: StoreContent;
  createdAt?: Date;
  updatedAt?: Date;
}
