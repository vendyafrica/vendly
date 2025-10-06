import { PaymentMethod } from '../enums';

export interface BuyerProfile {
  id: string;
  userId: string;
  
  // Basic Info
  firstName: string;
  lastName: string;
  displayName: string | null;
  avatarUrl: string | null;
  
  // Profile Settings
  isPublic: boolean;
  bio: string | null;
  
  // Preferences
  favoriteCategories: string[];
  
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  id: string;
  buyerId: string;
  
  label: string;
  
  // Address Details
  fullName: string;
  phoneNumber: string;
  country: string;
  city: string;
  streetAddress: string;
  apartmentSuite: string | null;
  postalCode: string | null;
  
  // Coordinates
  latitude: number | null;
  longitude: number | null;
  
  // Delivery Notes
  deliveryInstructions: string | null;
  
  isDefault: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentMethodInfo {
  id: string;
  buyerId: string;
  
  paymentType: PaymentMethod;
  
  // M-Pesa
  mpesaPhone: string | null;
  
  // Card (tokenized)
  cardLastFour: string | null;
  cardBrand: string | null;
  cardToken: string | null;
  cardExpiryMonth: number | null;
  cardExpiryYear: number | null;
  
  // Bank Transfer
  bankAccountNumber: string | null;
  bankName: string | null;
  
  isDefault: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface WishlistItem {
  id: string;
  buyerId: string;
  productId: string;
  variantId: string | null;
  addedAt: Date;
}

export interface WaitlistItem {
  id: string;
  buyerId: string;
  productId: string;
  variantId: string | null;
  notified: boolean;
  addedAt: Date;
}

export interface CartItem {
  id: string;
  buyerId: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  addedAt: Date;
  updatedAt: Date;
}