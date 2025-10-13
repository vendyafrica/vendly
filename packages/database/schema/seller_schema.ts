import { pgTable, text, varchar, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

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
        country: varchar("country", { length: 2 }).notNull(),
        city: text("city").notNull(),
        pickupAddress: text("pickup_address").notNull(),

        // Social & Contact
        whatsappPhone: text("whatsapp_phone"),
        instagramConnected: boolean("instagram_connected").default(false).notNull(),
        igBusinessAccountId: text("ig_business_account_id"),
        fbPageId: text("fb_page_id"),
        waCatalogId: text("wa_catalog_id"),

        // Verification
        tier: text("tier").default("free").notNull(), 
        verificationStatus: text("verification_status").default("pending").notNull(), 
        verificationNotes: text("verification_notes"),
        verifiedAt: timestamp("verified_at"),

        // Payout
        payoutMethod: text("payout_method").notNull(),
        payoutDetails: jsonb("payout_details").$type<{
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
        }>().notNull(),

        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
    });

