export interface Product {
  id: string;
  storeId: string;
  
  // Basic Info
  name: string;
  slug: string;
  description: string;
  sku: string | null;
  
  // Pricing
  price: number;
  compareAtPrice: number | null;
  costPerItem: number | null;
  
  // Inventory
  trackInventory: boolean;
  inventoryQuantity: number;
  allowBackorder: boolean;
  lowStockThreshold: number;
  
  // Categories & Discovery
  categories: string[];
  tags: string[];
  collectionId: string | null;
  
  // Media
  images: string[];
  videos: string[];
  aiGeneratedModelUrl: string | null;
  
  // Variants
  hasVariants: boolean;
  
  // Availability
  isActive: boolean;
  isFeatured: boolean;
  isSeasonal: boolean;
  availableFrom: Date | null;
  availableUntil: Date | null;
  
  // SEO
  metaTitle: string | null;
  metaDescription: string | null;
  
  // Stats
  totalSold: number;
  totalViews: number;
  totalLikes: number;
  averageRating: number;
  totalReviews: number;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariant {
  id: string;
  productId: string;
  
  // Variant Options
  option1: string | null;
  option1Value: string | null;
  option2: string | null;
  option2Value: string | null;
  option3: string | null;
  option3Value: string | null;
  
  sku: string | null;
  barcode: string | null;
  
  // Pricing
  price: number | null;
  compareAtPrice: number | null;
  
  // Inventory
  inventoryQuantity: number;
  
  // Media
  imageUrl: string | null;
  
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Collection {
  id: string;
  storeId: string;
  
  name: string;
  slug: string;
  description: string | null;
  
  imageUrl: string | null;
  
  // Seasonality
  isSeasonal: boolean;
  availableFrom: Date | null;
  availableUntil: Date | null;
  
  isActive: boolean;
  sortOrder: number;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductReview {
  id: string;
  productId: string;
  buyerId: string;
  orderItemId: string | null;
  
  rating: number;
  reviewText: string | null;
  images: string[];
  
  isVerifiedPurchase: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductLike {
  id: string;
  productId: string;
  buyerId: string;
  likedAt: Date;
}