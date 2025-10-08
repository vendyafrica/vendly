// apps/api/src/services/seller.service.ts
import { db, sellerProfile } from "@vendly/database";
import { eq } from "drizzle-orm";

// Type definitions (until @vendly/types package is properly configured)
type SellerTier = "free" | "pro";
type VerificationStatus = "pending" | "verified" | "rejected";
type Country = "KE" | "UG";
type PayoutMethod = "mobile_money" | "bank";

interface SellerProfile {
  id: string;
  userId: string;
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  country: Country;
  city: string;
  pickupAddress: string;
  whatsappPhone: string | null;
  instagramConnected: boolean;
  igBusinessAccountId?: string | null;
  fbPageId?: string | null;
  waCatalogId?: string | null;
  tier: SellerTier;
  verificationStatus: VerificationStatus;
  verificationNotes: string | null;
  verifiedAt: Date | null;
  payoutMethod: PayoutMethod;
  payoutDetails: {
    mobileMoney?: {
      provider: string;
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

export interface CreateSellerProfileInput {
  userId: string;
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  country: "KE" | "UG";
  city: string;
  pickupAddress: string;
  whatsappPhone?: string;
  payoutMethod: "mobile_money" | "bank";
  payoutDetails: {
    mobileMoney?: {
      provider: string;
      phone: string;
    };
    bank?: {
      accountName: string;
      accountNumber: string;
      bankName: string;
      branch?: string;
      swift?: string;
    };
  };
}

export interface UpdateSellerProfileInput {
  businessName?: string;
  businessEmail?: string;
  businessPhone?: string;
  city?: string;
  pickupAddress?: string;
  whatsappPhone?: string;
  payoutMethod?: "mobile_money" | "bank";
  payoutDetails?: {
    mobileMoney?: {
      provider: string;
      phone: string;
    };
    bank?: {
      accountName: string;
      accountNumber: string;
      bankName: string;
      branch?: string;
      swift?: string;
    };
  };
}

export interface UpdateSocialConnectionsInput {
  instagramConnected?: boolean;
  igBusinessAccountId?: string | null;
  fbPageId?: string | null;
  waCatalogId?: string | null;
}

export class SellerService {
  /**
   * Generate a unique seller profile ID
   */
  private generateId(): string {
    return `sel_${Math.random().toString(36).slice(2, 10)}`;
  }

  /**
   * Create a new seller profile
   */
  async createSellerProfile(input: CreateSellerProfileInput): Promise<string> {
    const sellerId = this.generateId();

    await db.insert(sellerProfile).values({
      id: sellerId,
      userId: input.userId,
      businessName: input.businessName,
      businessEmail: input.businessEmail,
      businessPhone: input.businessPhone,
      country: input.country,
      city: input.city,
      pickupAddress: input.pickupAddress,
      whatsappPhone: input.whatsappPhone ?? null,
      instagramConnected: false,
      igBusinessAccountId: null,
      fbPageId: null,
      waCatalogId: null,
      tier: "free",
      verificationStatus: "pending",
      verificationNotes: null,
      verifiedAt: null,
      payoutMethod: input.payoutMethod,
      payoutDetails: input.payoutDetails,
    });

    return sellerId;
  }

  /**
   * Get seller profile by ID
   */
  async getSellerProfileById(sellerId: string): Promise<SellerProfile | null> {
    const result = await db
      .select()
      .from(sellerProfile)
      .where(eq(sellerProfile.id, sellerId))
      .limit(1);

    if (result.length === 0) return null;

    const profile = result[0];
    return this.mapToSellerProfile(profile);
  }

  /**
   * Get seller profile by user ID
   */
  async getSellerProfileByUserId(userId: string): Promise<SellerProfile | null> {
    const result = await db
      .select()
      .from(sellerProfile)
      .where(eq(sellerProfile.userId, userId))
      .limit(1);

    if (result.length === 0) return null;

    const profile = result[0];
    return this.mapToSellerProfile(profile);
  }

  /**
   * Update seller profile
   */
  async updateSellerProfile(
    sellerId: string,
    input: UpdateSellerProfileInput
  ): Promise<boolean> {
    const updateData: Record<string, any> = {};

    if (input.businessName !== undefined) updateData.businessName = input.businessName;
    if (input.businessEmail !== undefined) updateData.businessEmail = input.businessEmail;
    if (input.businessPhone !== undefined) updateData.businessPhone = input.businessPhone;
    if (input.city !== undefined) updateData.city = input.city;
    if (input.pickupAddress !== undefined) updateData.pickupAddress = input.pickupAddress;
    if (input.whatsappPhone !== undefined) updateData.whatsappPhone = input.whatsappPhone;
    if (input.payoutMethod !== undefined) updateData.payoutMethod = input.payoutMethod;
    if (input.payoutDetails !== undefined) updateData.payoutDetails = input.payoutDetails;

    if (Object.keys(updateData).length === 0) return false;

    const result = await db
      .update(sellerProfile)
      .set(updateData)
      .where(eq(sellerProfile.id, sellerId));

    return true;
  }

  /**
   * Update social connections (Instagram, WhatsApp, Facebook)
   */
  async updateSocialConnections(
    sellerId: string,
    input: UpdateSocialConnectionsInput
  ): Promise<boolean> {
    const updateData: Record<string, any> = {};

    if (input.instagramConnected !== undefined) {
      updateData.instagramConnected = input.instagramConnected;
    }
    if (input.igBusinessAccountId !== undefined) {
      updateData.igBusinessAccountId = input.igBusinessAccountId;
    }
    if (input.fbPageId !== undefined) {
      updateData.fbPageId = input.fbPageId;
    }
    if (input.waCatalogId !== undefined) {
      updateData.waCatalogId = input.waCatalogId;
    }

    if (Object.keys(updateData).length === 0) return false;

    await db
      .update(sellerProfile)
      .set(updateData)
      .where(eq(sellerProfile.id, sellerId));

    return true;
  }

  /**
   * Update verification status
   */
  async updateVerificationStatus(
    sellerId: string,
    status: "pending" | "verified" | "rejected",
    notes?: string
  ): Promise<boolean> {
    const updateData: Record<string, any> = {
      verificationStatus: status,
      verificationNotes: notes ?? null,
    };

    if (status === "verified") {
      updateData.verifiedAt = new Date();
    }

    await db
      .update(sellerProfile)
      .set(updateData)
      .where(eq(sellerProfile.id, sellerId));

    return true;
  }

  /**
   * Upgrade seller tier
   */
  async upgradeTier(sellerId: string, tier: "free" | "pro"): Promise<boolean> {
    await db
      .update(sellerProfile)
      .set({ tier })
      .where(eq(sellerProfile.id, sellerId));

    return true;
  }

  /**
   * Check if user already has a seller profile
   */
  async hasSellerProfile(userId: string): Promise<boolean> {
    const result = await db
      .select({ id: sellerProfile.id })
      .from(sellerProfile)
      .where(eq(sellerProfile.userId, userId))
      .limit(1);

    return result.length > 0;
  }

  /**
   * Map database record to SellerProfile model
   */
  private mapToSellerProfile(profile: any): SellerProfile {
    return {
      id: profile.id,
      userId: profile.userId,
      businessName: profile.businessName,
      businessEmail: profile.businessEmail,
      businessPhone: profile.businessPhone,
      country: profile.country,
      city: profile.city,
      pickupAddress: profile.pickupAddress,
      whatsappPhone: profile.whatsappPhone,
      instagramConnected: profile.instagramConnected,
      igBusinessAccountId: profile.igBusinessAccountId,
      fbPageId: profile.fbPageId,
      waCatalogId: profile.waCatalogId,
      tier: profile.tier,
      verificationStatus: profile.verificationStatus,
      verificationNotes: profile.verificationNotes,
      verifiedAt: profile.verifiedAt,
      payoutMethod: profile.payoutMethod,
      payoutDetails: profile.payoutDetails,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }
}

// Export singleton instance
export const sellerService = new SellerService();