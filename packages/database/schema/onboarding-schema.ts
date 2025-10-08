// packages/database/schema/onboarding-schema.ts
import { pgTable, text, varchar, timestamp, boolean, integer, jsonb, doublePrecision, uniqueIndex } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { user } from "./auth-schema";

// Seller Profile table stores business & payout configuration
export const sellerProfile = pgTable(
    "seller_profile",
    {
        id: text("id").primaryKey(),
        userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),

        // Business Info
        businessName: text("business_name").notNull(),
        businessEmail: text("business_email").notNull(),
        businessPhone: text("business_phone").notNull(),

        // Location
        country: varchar("country", { length: 2 }).notNull(), // 'KE' | 'UG'
        city: text("city").notNull(),
        pickupAddress: text("pickup_address").notNull(),

        // Social & Contact
        whatsappPhone: text("whatsapp_phone"),
        instagramConnected: boolean("instagram_connected").default(false).notNull(),
        igBusinessAccountId: text("ig_business_account_id"),
        fbPageId: text("fb_page_id"),
        waCatalogId: text("wa_catalog_id"),

        // Verification
        tier: text("tier").default("free").notNull(), // 'free' | 'pro'
        verificationStatus: text("verification_status").default("pending").notNull(), // 'pending' | 'verified' | 'rejected'
        verificationNotes: text("verification_notes"),
        verifiedAt: timestamp("verified_at"),

        // Payout
        payoutMethod: text("payout_method").notNull(), // 'mobile_money' | 'bank'
        payoutDetails: jsonb("payout_details").$type<{
            mobileMoney?: {
                provider: string; // 'mpesa' | 'airtel' | 'mtn'
                phone: string;
            };
            bank?: {
                accountName: string;
                accountNumber: string;
                bankName: string;
                branch?: string | null;
                swift?: string | null;
            };
        }>().notNull(),

        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
    });

// Store table reflects storefront configuration and stats

export const store = pgTable(
    "store",
    {
        id: text("id").primaryKey(),
        sellerId: text("seller_id").notNull().references(() => sellerProfile.id, { onDelete: "cascade" }),

        // Basic Info
        name: text("name").notNull(),
        slug: text("slug").notNull(),
        customDomain: text("custom_domain"),
        description: text("description").default("").notNull(),
        tagline: text("tagline"),

        // Branding
        logoUrl: text("logo_url"),
        bannerUrl: text("banner_url"),
        primaryColor: text("primary_color"),
        secondaryColor: text("secondary_color"),
        templateId: text("template_id"),

        // Location & Locale
        country: varchar("country", { length: 2 }).notNull(),
        currency: varchar("currency", { length: 3 }).notNull(),
        city: text("city").notNull(),
        pickupAddress: text("pickup_address").notNull(),
        address: text("address"),
        latitude: doublePrecision("latitude"),
        longitude: doublePrecision("longitude"),

        // Categories & Tags
        primaryCategory: text("primary_category").notNull(),
        categories: jsonb("categories").$type<string[]>().default(sql`'[]'::jsonb`).notNull(),
        tags: jsonb("tags").$type<string[]>().default(sql`'[]'::jsonb`).notNull(),

        // Policies
        returnPolicy: text("return_policy"),
        shippingPolicy: text("shipping_policy"),
        privacyPolicy: text("privacy_policy"),
        termsOfService: text("terms_of_service"),

        // Operating & Discoverability
        isActive: boolean("is_active").default(true).notNull(),
        operatingHours: jsonb("operating_hours").$type<Record<string, string> | null>().default(sql`NULL`),
        marketplaceListed: boolean("marketplace_listed").default(true).notNull(),

        // Social Links
        instagramUrl: text("instagram_url"),
        facebookUrl: text("facebook_url"),
        twitterUrl: text("twitter_url"),
        tiktokUrl: text("tiktok_url"),
        websiteUrl: text("website_url"),

        // Social source metadata
        socialSource: jsonb("social_source").$type<{
            instagram?: { lastSyncAt?: string; importedCount: number };
            whatsappCatalog?: { lastSyncAt?: string; importedCount: number };
        }>(),

        // About & Announcement
        aboutSection: text("about_section"),
        announcement: text("announcement"),
        announcementActive: boolean("announcement_active").default(false).notNull(),

        // Stats
        totalProducts: integer("total_products").default(0).notNull(),
        totalSales: integer("total_sales").default(0).notNull(),
        totalFollowers: integer("total_followers").default(0).notNull(),
        averageRating: doublePrecision("average_rating").default(0).notNull(),
        totalReviews: integer("total_reviews").default(0).notNull(),

        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
    },
    (t) => [
        uniqueIndex("store_slug_uq").on(t.slug),
    ]
);