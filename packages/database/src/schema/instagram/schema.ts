// import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
// import { user } from "../../schema/auth/schema";

// export const instagramAccount = pgTable("instagram_account", {
//   id: text("id").primaryKey(),

//   userId: text("user_id")
//     .notNull()
//     .references(() => user.id, { onDelete: "cascade" }),

//   instagramUserId: text("instagram_user_id").notNull(), // <IG_ID>
//   username: text("username"),
//   accountType: text("account_type"), // Business, Media_Creator

//   /* TOKENS */
//   shortLivedToken: text("short_lived_token"),       // 1-hour token
//   longLivedToken: text("long_lived_token"),         // 60-day token
//   longLivedTokenExpiresAt: timestamp("ll_token_exp"),

//   scopes: text("scopes"), // comma-separated list of granted IG scopes

//   /* Profile sync info */
//   profilePictureUrl: text("profile_picture_url"),
//   followersCount: integer("followers_count"),
//   followsCount: integer("follows_count"),
//   mediaCount: integer("media_count"),

//   lastSyncedAt: timestamp("last_synced_at"),

//   createdAt: timestamp("created_at").defaultNow().notNull(),
//   updatedAt: timestamp("updated_at")
//     .defaultNow()
//     .$onUpdate(() => new Date())
//     .notNull(),
// });

// export const instagramMedia = pgTable("instagram_media", {
//   id: text("id").primaryKey(), // media_id from IG

//   accountId: text("account_id")
//     .notNull()
//     .references(() => instagramAccount.id, { onDelete: "cascade" }),

//   caption: text("caption"),
//   mediaType: text("media_type"),     // IMAGE, VIDEO, CAROUSEL
//   mediaUrl: text("media_url"),
//   thumbnailUrl: text("thumbnail_url"),
//   permalink: text("permalink"),

//   timestamp: timestamp("timestamp"),
//   likeCount: integer("like_count"),
//   commentsCount: integer("comments_count"),

//   createdAt: timestamp("created_at").defaultNow(),
// });

// export const instagramComment = pgTable("instagram_comment", {
//   id: text("id").primaryKey(),

//   mediaId: text("media_id")
//     .notNull()
//     .references(() => instagramMedia.id, { onDelete: "cascade" }),

//   accountId: text("account_id")
//     .notNull()
//     .references(() => instagramAccount.id),

//   username: text("username"),
//   text: text("text"),
//   timestamp: timestamp("timestamp"),

//   createdAt: timestamp("created_at").defaultNow(),
// });
