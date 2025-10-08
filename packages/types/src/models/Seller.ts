import { SellerTier, VerificationStatus, Country, PayoutMethod, MobileMoneyProvider } from '../enums';

export interface SellerProfile {
  id: string;
  userId: string;

  // Business Info
  businessName: string;
  businessEmail: string;
  businessPhone: string;

  // Location
  country: Country;
  city: string;
  pickupAddress: string;

  // Social & Contact
  whatsappPhone: string | null;
  instagramConnected: boolean;
  igBusinessAccountId?: string | null;
  fbPageId?: string | null;
  waCatalogId?: string | null;

  // Verification
  tier: SellerTier;
  verificationStatus: VerificationStatus;
  verificationNotes: string | null;
  verifiedAt: Date | null;

  // Payout
  payoutMethod: PayoutMethod;
  payoutDetails: {
    mobileMoney?: {
      provider: MobileMoneyProvider;
      phone: string;
    };
    bank?: {
      accountName: string;
      accountNumber: string;
      bankName: string;
      branch?: string | null;
      swift?: string | null;
    };
  };

  createdAt: Date;
  updatedAt: Date;
}