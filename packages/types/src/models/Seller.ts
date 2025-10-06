import { SellerTier, VerificationStatus } from '../enums';

export interface SellerProfile {
  id: string;
  userId: string;
  
  // Business Info
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  
  // Verification
  tier: SellerTier;
  verificationStatus: VerificationStatus;
  verificationNotes: string | null;
  verifiedAt: Date | null;
  
  // Payout Info
  mpesaPhone: string | null;
  mpesaBusinessNumber: string | null;
  bankAccountNumber: string | null;
  bankName: string | null;
  bankBranch: string | null;
  
  createdAt: Date;
  updatedAt: Date;
}