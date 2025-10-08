// apps/api/src/services/onboarding.ts
import { db, sellerProfile, store } from "@vendly/database";
import { eq } from "drizzle-orm";

// Local helpers (kept here to minimize file churn during scaffolding)
function newId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function currencyForCountry(country: "KE" | "UG"): "KES" | "UGX" {
  return country === "KE" ? "KES" : "UGX";
}

async function ensureUniqueSlug(baseSlug: string): Promise<string> {
  // Check if base slug exists; if not, use it; else increment suffix
  let candidate = baseSlug;
  let suffix = 2;

  // First quick check
  const existing = await db.select().from(store).where(eq(store.slug, candidate)).limit(1);
  if (existing.length === 0) return candidate;

  // Try incrementing
  // NOTE: This loop is safe for MVP scale; in high contention, use DB-level unique + retry on conflict
  // and an UPSERT with suffix generation in SQL.
  // eslint-disable-next-line no-constant-condition
  while (true) {
    candidate = `${baseSlug}-${suffix}`;
    const exists = await db.select().from(store).where(eq(store.slug, candidate)).limit(1);
    if (exists.length === 0) return candidate;
    suffix++;
  }
}

// Types reflecting the incoming payload shape from router zod schema
type Country = "KE" | "UG";
type PayoutMethod = "mobile_money" | "bank";
type MobileMoneyProvider = "mpesa" | "airtel" | "mtn";

export interface OnboardingAccount {
  fullName: string;
  email: string;
  phone: string;
  country: Country;
}

export interface OnboardingStore {
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

export interface OnboardingPayout {
  method: PayoutMethod;
  mobileMoney?: { provider: MobileMoneyProvider; phone: string };
  bank?: { accountName: string; accountNumber: string; bankName: string; branch?: string; swift?: string };
}

export interface OnboardingSocial {
  instagram: boolean;
  whatsappCatalog: boolean;
}

export interface OnboardingPayload {
  account: OnboardingAccount;
  store: OnboardingStore;
  payout: OnboardingPayout;
  social: OnboardingSocial;
}

export interface OnboardingResult {
  userId: string;
  sellerProfileId: string;
  storeId: string;
  storeSlug: string;
}

/**
 * Creates: User (TODO - link to auth), SellerProfile, Store
 * Returns identifiers required by the client to proceed.
 * Persistence uses @vendly/database (drizzle) with the onboarding schema.
 */
export async function createOnboarding(payload: OnboardingPayload): Promise<OnboardingResult> {
  const { account, store: storeInput, payout, social } = payload;

  // TODO: Replace with actual auth user context once available
  const userId = newId("usr");

  // Create or normalize data
  const normalizedCountry: Country = account.country;
  const inferredCurrency = currencyForCountry(normalizedCountry);
  const finalSlug = await ensureUniqueSlug(storeInput.slug);

  // Insert SellerProfile
  const sellerId = newId("sel");
  await db.insert(sellerProfile).values({
    id: sellerId,
    userId,

    businessName: storeInput.name,
    businessEmail: account.email,
    businessPhone: account.phone,

    country: normalizedCountry,
    city: storeInput.city,
    pickupAddress: storeInput.pickupAddress,

    whatsappPhone: account.phone,
    instagramConnected: !!social.instagram,
    igBusinessAccountId: null,
    fbPageId: null,
    waCatalogId: null,

    tier: "free",
    verificationStatus: "pending",
    verificationNotes: null,
    verifiedAt: null,

    payoutMethod: payout.method,
    mmProvider: payout.method === "mobile_money" ? payout.mobileMoney?.provider ?? null : null,
    mmPhone: payout.method === "mobile_money" ? payout.mobileMoney?.phone ?? null : null,
    bankAccountName: payout.method === "bank" ? payout.bank?.accountName ?? null : null,
    bankAccountNumber: payout.method === "bank" ? payout.bank?.accountNumber ?? null : null,
    bankName: payout.method === "bank" ? payout.bank?.bankName ?? null : null,
    bankBranch: payout.method === "bank" ? payout.bank?.branch ?? null : null,
    bankSwift: payout.method === "bank" ? payout.bank?.swift ?? null : null,
  });

  // Insert Store
  const storeIdVal = newId("str");
  await db.insert(store).values({
    id: storeIdVal,
    sellerId,

    name: storeInput.name,
    slug: finalSlug,
    customDomain: null,
    description: storeInput.description ?? "",
    tagline: null,

    logoUrl: storeInput.logoUrl ?? null,
    bannerUrl: storeInput.bannerUrl ?? null,
    primaryColor: storeInput.primaryColor ?? null,
    secondaryColor: storeInput.secondaryColor ?? null,
    templateId: storeInput.templateId ?? null,

    country: normalizedCountry,
    currency: inferredCurrency,
    city: storeInput.city,
    pickupAddress: storeInput.pickupAddress,
    address: null,
    latitude: null,
    longitude: null,

    primaryCategory: storeInput.primaryCategory,
    categories: [],
    tags: [],

    returnPolicy: null,
    shippingPolicy: null,
    privacyPolicy: null,
    termsOfService: null,

    isActive: true,
    operatingHours: null,
    marketplaceListed: storeInput.marketplaceListed ?? true,

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

  return {
    userId,
    sellerProfileId: sellerId,
    storeId: storeIdVal,
    storeSlug: finalSlug,
  };
}