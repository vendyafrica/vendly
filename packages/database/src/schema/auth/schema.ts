import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  json,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),

  name: text("name"),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash"), // null for OAuth-only

  emailVerified: boolean("email_verified").default(false).notNull(),
  phoneNumber: text("phone_number"),
  phoneVerified: boolean("phone_verified").default(false).notNull(),

  image: text("image"),
  role: text("role").default("buyer").notNull(),
  isActive: boolean("is_active").default(true).notNull(),

  metadata: json("metadata"), // free space for onboarding steps etc.

  lastLogin: timestamp("last_login"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),

  providerId: text("provider_id").notNull(), // google, github, etc.
  providerAccountId: text("provider_account_id").notNull(), // provider user id

  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  scope: text("scope"),

  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),

  rawProfile: json("raw_profile"), // provider profile JSON

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  token: text("token").notNull().unique(),

  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),

  sessionType: text("session_type").default("web").notNull(), // web, api, mobile
  lastSeenAt: timestamp("last_seen_at"),
  expiresAt: timestamp("expires_at").notNull(),
  revoked: boolean("revoked").default(false).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),

  identifier: text("identifier").notNull(), // email or phone
  value: text("value").notNull(), // OTP or token
  expiresAt: timestamp("expires_at").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
