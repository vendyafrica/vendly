import { pgTable ,text } from "drizzle-orm/pg-core";


export const store = pgTable("store", {
  id: text("id").primaryKey(),
  storeOwnerId: text("store_owner_id").notNull(),
  name: text("name").notNull(),
  subdomain: text("subdomain").notNull().unique(),
  description: text("description"),
  avgRating: text("avg_rating"),
  phoneNumber: text("phone_number"),
  location: text("location"),
  socialMediaLinks: text("social_media_links"),
  storePolicies: text("store_policies"),
  storeLogo: text("store_logo"),
  storeBanner: text("store_banner"),
  storeReviews: text("store_reviews"),
  storeProducts: text("store_products"),
  salesMade: text("sales_made"),
  reviewCount: text("review_count"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});



