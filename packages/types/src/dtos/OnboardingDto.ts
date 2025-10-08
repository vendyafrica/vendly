import { Country, PayoutMethod, MobileMoneyProvider } from '../enums';

/** Seller onboarding segment: account */
export interface SellerOnboardingAccount {
  fullName: string;
  email: string;
  phone: string;
  country: Country;
}

/** Seller onboarding segment: store */
export interface SellerOnboardingStore {
  name: string;
  slug: string;
  primaryCategory: string;
  city: string;
  pickupAddress: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  templateId?: string;
  primaryColor?: string;
  secondaryColor?: string;
  marketplaceListed?: boolean;
}

/** Seller onboarding segment: payout destination */
export interface SellerOnboardingPayout {
  method: PayoutMethod;
  mobileMoney?: {
    provider: MobileMoneyProvider;
    phone: string;
  };
  bank?: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    branch?: string;
    swift?: string;
  };
}

/** Seller onboarding segment: social connections */
export interface SellerOnboardingSocial {
  instagram: boolean;
  whatsappCatalog: boolean;
}

/** Full onboarding request payload */
export interface SellerOnboardingRequest {
  account: SellerOnboardingAccount;
  store: SellerOnboardingStore;
  payout: SellerOnboardingPayout;
  social: SellerOnboardingSocial;
}

/** Full onboarding response payload */
export interface SellerOnboardingResponse {
  userId: string;
  sellerProfileId: string;
  storeId: string;
  storeSlug: string;
  accessToken?: string;
  refreshToken?: string;
}

/** Sync result after onboarding initialization */
export interface InitialImportResult {
  instagramImported?: number;
  whatsappCatalogImported?: number;
}

/** Optional response for kickoff endpoints that include import counts */
export interface SellerOnboardingWithImportResponse extends SellerOnboardingResponse {
  initialImport?: InitialImportResult;
}