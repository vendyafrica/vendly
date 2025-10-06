export interface CreateStoreRequest {
  name: string;
  description: string;
  primaryCategory: string;
  categories: string[];
  tags: string[];
  city: string;
  country: string;
}

export interface UpdateStoreRequest {
  name?: string;
  description?: string;
  tagline?: string;
  logoUrl?: string;
  bannerUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  categories?: string[];
  tags?: string[];
  aboutSection?: string;
  announcement?: string;
  announcementActive?: boolean;
  returnPolicy?: string;
  shippingPolicy?: string;
  instagramUrl?: string;
  facebookUrl?: string;
}