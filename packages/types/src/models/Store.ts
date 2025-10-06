export interface Store {
  id: string;
  sellerId: string;
  
  // Basic Info
  name: string;
  slug: string;
  customDomain: string | null;
  description: string;
  tagline: string | null;
  
  // Branding
  logoUrl: string | null;
  bannerUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  templateId: string;
  
  // Location
  country: string;
  city: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  
  // Categories & Tags
  primaryCategory: string;
  categories: string[];
  tags: string[];
  
  // Store Policies
  returnPolicy: string | null;
  shippingPolicy: string | null;
  privacyPolicy: string | null;
  termsOfService: string | null;
  
  // Operating Info
  isActive: boolean;
  operatingHours: Record<string, string> | null;
  
  // Social Links
  instagramUrl: string | null;
  facebookUrl: string | null;
  twitterUrl: string | null;
  tiktokUrl: string | null;
  websiteUrl: string | null;
  
  // Announcements & About
  aboutSection: string | null;
  announcement: string | null;
  announcementActive: boolean;
  
  // Stats
  totalProducts: number;
  totalSales: number;
  totalFollowers: number;
  averageRating: number;
  totalReviews: number;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface StoreReview {
  id: string;
  storeId: string;
  buyerId: string;
  orderId: string | null;
  
  rating: number;
  reviewText: string | null;
  
  isVerifiedPurchase: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface StoreFollower {
  id: string;
  storeId: string;
  buyerId: string;
  followedAt: Date;
}