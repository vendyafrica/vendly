import { Country } from '../enums';

/**
 * CreateStoreRequest
 * - currency is inferred by backend from country (KE -> KES, UG -> UGX)
 * - marketplaceListed defaults to true if omitted
 */
export interface CreateStoreRequest {
  // Required
  name: string;
  slug: string;
  primaryCategory: string;
  city: string;
  country: Country;
  pickupAddress: string;

  // Optional
  description?: string;
  categories?: string[];
  tags?: string[];
  tagline?: string;
  logoUrl?: string;
  bannerUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  templateId?: string;
  marketplaceListed?: boolean;
}

/**
 * UpdateStoreRequest
 * - Partial updates for store configuration and branding
 */
export interface UpdateStoreRequest {
  name?: string;
  slug?: string;
  description?: string;
  tagline?: string;

  // Branding / Theme
  logoUrl?: string;
  bannerUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  templateId?: string;

  // Location & Discoverability
  city?: string;
  pickupAddress?: string;
  marketplaceListed?: boolean;

  // Taxonomy & Content
  primaryCategory?: string;
  categories?: string[];
  tags?: string[];
  aboutSection?: string;
  announcement?: string;
  announcementActive?: boolean;
  returnPolicy?: string;
  shippingPolicy?: string;

  // Social
  instagramUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  tiktokUrl?: string;
  websiteUrl?: string;
}