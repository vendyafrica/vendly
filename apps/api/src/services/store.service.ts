// apps/api/src/services/store.service.ts
import { db, store } from "@vendly/database";
import { eq, and, like, desc, sql } from "drizzle-orm";

// Type definitions
type Country = "KE" | "UG";
type Currency = "KES" | "UGX";

interface Store {
  id: string;
  sellerId: string;
  name: string;
  slug: string;
  customDomain: string | null;
  description: string;
  tagline: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  templateId: string | null;
  country: Country;
  currency: Currency;
  city: string;
  pickupAddress: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  primaryCategory: string;
  categories: string[];
  tags: string[];
  returnPolicy: string | null;
  shippingPolicy: string | null;
  privacyPolicy: string | null;
  termsOfService: string | null;
  isActive: boolean;
  operatingHours: Record<string, string> | null;
  marketplaceListed: boolean;
  instagramUrl: string | null;
  facebookUrl: string | null;
  twitterUrl: string | null;
  tiktokUrl: string | null;
  websiteUrl: string | null;
  socialSource?: {
    instagram?: { lastSyncAt?: string; importedCount: number };
    whatsappCatalog?: { lastSyncAt?: string; importedCount: number };
  };
  aboutSection: string | null;
  announcement: string | null;
  announcementActive: boolean;
  totalProducts: number;
  totalSales: number;
  totalFollowers: number;
  averageRating: number;
  totalReviews: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateStoreInput {
  sellerId: string;
  name: string;
  slug: string;
  country: Country;
  currency: Currency;
  city: string;
  pickupAddress: string;
  primaryCategory: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  templateId?: string;
  primaryColor?: string;
  secondaryColor?: string;
  marketplaceListed?: boolean;
}

export interface UpdateStoreInput {
  name?: string;
  description?: string;
  tagline?: string;
  logoUrl?: string;
  bannerUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  templateId?: string;
  city?: string;
  pickupAddress?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  primaryCategory?: string;
  categories?: string[];
  tags?: string[];
  returnPolicy?: string;
  shippingPolicy?: string;
  privacyPolicy?: string;
  termsOfService?: string;
  operatingHours?: Record<string, string> | null;
  marketplaceListed?: boolean;
  aboutSection?: string;
  announcement?: string;
  announcementActive?: boolean;
}

export interface UpdateSocialLinksInput {
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  twitterUrl?: string | null;
  tiktokUrl?: string | null;
  websiteUrl?: string | null;
}

export interface UpdateStoreStatsInput {
  totalProducts?: number;
  totalSales?: number;
  totalFollowers?: number;
  averageRating?: number;
  totalReviews?: number;
}

export class StoreService {
  /**
   * Generate a unique store ID
   */
  private generateId(): string {
    return `str_${Math.random().toString(36).slice(2, 10)}`;
  }

  /**
   * Ensure slug is unique by appending suffix if needed
   */
  async ensureUniqueSlug(baseSlug: string, excludeStoreId?: string): Promise<string> {
    let candidate = baseSlug;
    let suffix = 2;

    // First quick check
    const existing = await db
      .select()
      .from(store)
      .where(
        excludeStoreId
          ? and(eq(store.slug, candidate), sql`${store.id} != ${excludeStoreId}`)
          : eq(store.slug, candidate)
      )
      .limit(1);

    if (existing.length === 0) return candidate;

    // Try incrementing
    while (true) {
      candidate = `${baseSlug}-${suffix}`;
      const exists = await db
        .select()
        .from(store)
        .where(
          excludeStoreId
            ? and(eq(store.slug, candidate), sql`${store.id} != ${excludeStoreId}`)
            : eq(store.slug, candidate)
        )
        .limit(1);

      if (exists.length === 0) return candidate;
      suffix++;
    }
  }

  /**
   * Create a new store
   */
  async createStore(input: CreateStoreInput): Promise<string> {
    const storeId = this.generateId();
    const finalSlug = await this.ensureUniqueSlug(input.slug);

    await db.insert(store).values({
      id: storeId,
      sellerId: input.sellerId,
      name: input.name,
      slug: finalSlug,
      customDomain: null,
      description: input.description ?? "",
      tagline: null,
      logoUrl: input.logoUrl ?? null,
      bannerUrl: input.bannerUrl ?? null,
      primaryColor: input.primaryColor ?? null,
      secondaryColor: input.secondaryColor ?? null,
      templateId: input.templateId ?? null,
      country: input.country,
      currency: input.currency,
      city: input.city,
      pickupAddress: input.pickupAddress,
      address: null,
      latitude: null,
      longitude: null,
      primaryCategory: input.primaryCategory,
      categories: [],
      tags: [],
      returnPolicy: null,
      shippingPolicy: null,
      privacyPolicy: null,
      termsOfService: null,
      isActive: true,
      operatingHours: null,
      marketplaceListed: input.marketplaceListed ?? true,
      instagramUrl: null,
      facebookUrl: null,
      twitterUrl: null,
      tiktokUrl: null,
      websiteUrl: null,
      socialSource: null,
      aboutSection: null,
      announcement: null,
      announcementActive: false,
      totalProducts: 0,
      totalSales: 0,
      totalFollowers: 0,
      averageRating: 0,
      totalReviews: 0,
    });

    return storeId;
  }

  /**
   * Get store by ID
   */
  async getStoreById(storeId: string): Promise<Store | null> {
    const result = await db
      .select()
      .from(store)
      .where(eq(store.id, storeId))
      .limit(1);

    if (result.length === 0) return null;
    return this.mapToStore(result[0]);
  }

  /**
   * Get store by slug
   */
  async getStoreBySlug(slug: string): Promise<Store | null> {
    const result = await db
      .select()
      .from(store)
      .where(eq(store.slug, slug))
      .limit(1);

    if (result.length === 0) return null;
    return this.mapToStore(result[0]);
  }

  /**
   * Get store by seller ID
   */
  async getStoreBySellerId(sellerId: string): Promise<Store | null> {
    const result = await db
      .select()
      .from(store)
      .where(eq(store.sellerId, sellerId))
      .limit(1);

    if (result.length === 0) return null;
    return this.mapToStore(result[0]);
  }

  /**
   * Get stores by category
   */
  async getStoresByCategory(category: string, limit = 20, offset = 0): Promise<Store[]> {
    const results = await db
      .select()
      .from(store)
      .where(
        and(
          eq(store.primaryCategory, category),
          eq(store.isActive, true),
          eq(store.marketplaceListed, true)
        )
      )
      .orderBy(desc(store.totalFollowers))
      .limit(limit)
      .offset(offset);

    return results.map((s: any): Store => this.mapToStore(s));
  }

  /**
   * Search stores by name or description
   */
  async searchStores(query: string, limit = 20, offset = 0): Promise<Store[]> {
    const searchPattern = `%${query}%`;
    const results = await db
      .select()
      .from(store)
      .where(
        and(
          sql`(${store.name} ILIKE ${searchPattern} OR ${store.description} ILIKE ${searchPattern})`,
          eq(store.isActive, true),
          eq(store.marketplaceListed, true)
        )
      )
      .orderBy(desc(store.totalFollowers))
      .limit(limit)
      .offset(offset);

    return results.map((s: any) => this.mapToStore(s));
  }

  /**
   * Update store information
   */
  async updateStore(storeId: string, input: UpdateStoreInput): Promise<boolean> {
    const updateData: Record<string, any> = {};

    if (input.name !== undefined) updateData.name = input.name;
    if (input.description !== undefined) updateData.description = input.description;
    if (input.tagline !== undefined) updateData.tagline = input.tagline;
    if (input.logoUrl !== undefined) updateData.logoUrl = input.logoUrl;
    if (input.bannerUrl !== undefined) updateData.bannerUrl = input.bannerUrl;
    if (input.primaryColor !== undefined) updateData.primaryColor = input.primaryColor;
    if (input.secondaryColor !== undefined) updateData.secondaryColor = input.secondaryColor;
    if (input.templateId !== undefined) updateData.templateId = input.templateId;
    if (input.city !== undefined) updateData.city = input.city;
    if (input.pickupAddress !== undefined) updateData.pickupAddress = input.pickupAddress;
    if (input.address !== undefined) updateData.address = input.address;
    if (input.latitude !== undefined) updateData.latitude = input.latitude;
    if (input.longitude !== undefined) updateData.longitude = input.longitude;
    if (input.primaryCategory !== undefined) updateData.primaryCategory = input.primaryCategory;
    if (input.categories !== undefined) updateData.categories = input.categories;
    if (input.tags !== undefined) updateData.tags = input.tags;
    if (input.returnPolicy !== undefined) updateData.returnPolicy = input.returnPolicy;
    if (input.shippingPolicy !== undefined) updateData.shippingPolicy = input.shippingPolicy;
    if (input.privacyPolicy !== undefined) updateData.privacyPolicy = input.privacyPolicy;
    if (input.termsOfService !== undefined) updateData.termsOfService = input.termsOfService;
    if (input.operatingHours !== undefined) updateData.operatingHours = input.operatingHours;
    if (input.marketplaceListed !== undefined) updateData.marketplaceListed = input.marketplaceListed;
    if (input.aboutSection !== undefined) updateData.aboutSection = input.aboutSection;
    if (input.announcement !== undefined) updateData.announcement = input.announcement;
    if (input.announcementActive !== undefined) updateData.announcementActive = input.announcementActive;

    if (Object.keys(updateData).length === 0) return false;

    await db.update(store).set(updateData).where(eq(store.id, storeId));
    return true;
  }

  /**
   * Update store social links
   */
  async updateSocialLinks(storeId: string, input: UpdateSocialLinksInput): Promise<boolean> {
    const updateData: Record<string, any> = {};

    if (input.instagramUrl !== undefined) updateData.instagramUrl = input.instagramUrl;
    if (input.facebookUrl !== undefined) updateData.facebookUrl = input.facebookUrl;
    if (input.twitterUrl !== undefined) updateData.twitterUrl = input.twitterUrl;
    if (input.tiktokUrl !== undefined) updateData.tiktokUrl = input.tiktokUrl;
    if (input.websiteUrl !== undefined) updateData.websiteUrl = input.websiteUrl;

    if (Object.keys(updateData).length === 0) return false;

    await db.update(store).set(updateData).where(eq(store.id, storeId));
    return true;
  }

  /**
   * Update store stats
   */
  async updateStoreStats(storeId: string, input: UpdateStoreStatsInput): Promise<boolean> {
    const updateData: Record<string, any> = {};

    if (input.totalProducts !== undefined) updateData.totalProducts = input.totalProducts;
    if (input.totalSales !== undefined) updateData.totalSales = input.totalSales;
    if (input.totalFollowers !== undefined) updateData.totalFollowers = input.totalFollowers;
    if (input.averageRating !== undefined) updateData.averageRating = input.averageRating;
    if (input.totalReviews !== undefined) updateData.totalReviews = input.totalReviews;

    if (Object.keys(updateData).length === 0) return false;

    await db.update(store).set(updateData).where(eq(store.id, storeId));
    return true;
  }

  /**
   * Increment product count
   */
  async incrementProductCount(storeId: string, amount = 1): Promise<boolean> {
    await db
      .update(store)
      .set({ totalProducts: sql`${store.totalProducts} + ${amount}` })
      .where(eq(store.id, storeId));
    return true;
  }

  /**
   * Decrement product count
   */
  async decrementProductCount(storeId: string, amount = 1): Promise<boolean> {
    await db
      .update(store)
      .set({ totalProducts: sql`GREATEST(0, ${store.totalProducts} - ${amount})` })
      .where(eq(store.id, storeId));
    return true;
  }

  /**
   * Update social source metadata (for imports)
   */
  async updateSocialSource(
    storeId: string,
    source: "instagram" | "whatsappCatalog",
    importedCount: number
  ): Promise<boolean> {
    const currentStore = await this.getStoreById(storeId);
    if (!currentStore) return false;

    const socialSource = currentStore.socialSource || {};
    socialSource[source] = {
      lastSyncAt: new Date().toISOString(),
      importedCount,
    };

    await db
      .update(store)
      .set({ socialSource })
      .where(eq(store.id, storeId));

    return true;
  }

  /**
   * Toggle store active status
   */
  async toggleActiveStatus(storeId: string, isActive: boolean): Promise<boolean> {
    await db.update(store).set({ isActive }).where(eq(store.id, storeId));
    return true;
  }

  /**
   * Set custom domain
   */
  async setCustomDomain(storeId: string, domain: string | null): Promise<boolean> {
    await db.update(store).set({ customDomain: domain }).where(eq(store.id, storeId));
    return true;
  }

  /**
   * Map database record to Store model
   */
  private mapToStore(storeData: any): Store {
    return {
      id: storeData.id,
      sellerId: storeData.sellerId,
      name: storeData.name,
      slug: storeData.slug,
      customDomain: storeData.customDomain,
      description: storeData.description,
      tagline: storeData.tagline,
      logoUrl: storeData.logoUrl,
      bannerUrl: storeData.bannerUrl,
      primaryColor: storeData.primaryColor,
      secondaryColor: storeData.secondaryColor,
      templateId: storeData.templateId,
      country: storeData.country,
      currency: storeData.currency,
      city: storeData.city,
      pickupAddress: storeData.pickupAddress,
      address: storeData.address,
      latitude: storeData.latitude,
      longitude: storeData.longitude,
      primaryCategory: storeData.primaryCategory,
      categories: storeData.categories,
      tags: storeData.tags,
      returnPolicy: storeData.returnPolicy,
      shippingPolicy: storeData.shippingPolicy,
      privacyPolicy: storeData.privacyPolicy,
      termsOfService: storeData.termsOfService,
      isActive: storeData.isActive,
      operatingHours: storeData.operatingHours,
      marketplaceListed: storeData.marketplaceListed,
      instagramUrl: storeData.instagramUrl,
      facebookUrl: storeData.facebookUrl,
      twitterUrl: storeData.twitterUrl,
      tiktokUrl: storeData.tiktokUrl,
      websiteUrl: storeData.websiteUrl,
      socialSource: storeData.socialSource,
      aboutSection: storeData.aboutSection,
      announcement: storeData.announcement,
      announcementActive: storeData.announcementActive,
      totalProducts: storeData.totalProducts,
      totalSales: storeData.totalSales,
      totalFollowers: storeData.totalFollowers,
      averageRating: storeData.averageRating,
      totalReviews: storeData.totalReviews,
      createdAt: storeData.createdAt,
      updatedAt: storeData.updatedAt,
    };
  }
}

// Export singleton instance
export const storeService = new StoreService();