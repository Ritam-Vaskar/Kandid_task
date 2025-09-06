import { pgTable, text, integer, real, timestamp, boolean } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

// Auth tables required by better-auth
export const user = pgTable("user", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  email: text("email").unique().notNull(),
  name: text("name"),
  image: text("image"),
  emailVerified: boolean("emailVerified").notNull().default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").unique().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

// Your existing application tables
export const users = pgTable("users", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  email: text("email").unique().notNull(),
  name: text("name"),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const campaigns = pgTable("campaigns", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  name: text("name").notNull(),
  status: text("status", { enum: ["draft", "active", "paused", "completed"] }).default("draft"),
  description: text("description"),
  totalLeads: integer("total_leads").default(0),
  requestSent: integer("request_sent").default(0),
  requestAccepted: integer("request_accepted").default(0),
  requestReplied: integer("request_replied").default(0),
  conversionRate: real("conversion_rate").default(0),
  startDate: timestamp("start_date").defaultNow().notNull(),
  endDate: timestamp("end_date"),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const leads = pgTable("leads", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  name: text("name").notNull(),
  email: text("email"),
  title: text("title"),
  company: text("company"),
  linkedinUrl: text("linkedin_url"),
  profileImage: text("profile_image"),
  status: text("status", {
    enum: ["pending", "contacted", "responded", "converted", "rejected"],
  }).default("pending"),
  campaignId: text("campaign_id").notNull().references(() => campaigns.id, { onDelete: "cascade" }),
  lastContactDate: timestamp("last_contact_date"),
  notes: text("notes"),
  activityData: text("activity_data"), // store JSON string or use jsonb
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const linkedinAccounts = pgTable("linkedin_accounts", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  name: text("name").notNull(),
  email: text("email").notNull(),
  profileImage: text("profile_image"),
  status: text("status", { enum: ["connected", "disconnected", "pending"] }).default("pending"),
  requestsUsed: integer("requests_used").default(0),
  requestsLimit: integer("requests_limit").default(30),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const activities = pgTable("activities", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  type: text("type", {
    enum: ["invitation_sent", "connection_accepted", "message_sent", "follow_up"],
  }).notNull(),
  description: text("description").notNull(),
  leadId: text("lead_id").notNull().references(() => leads.id, { onDelete: "cascade" }),
  campaignId: text("campaign_id").notNull().references(() => campaigns.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type Campaign = typeof campaigns.$inferSelect;
export type Lead = typeof leads.$inferSelect;
export type LinkedinAccount = typeof linkedinAccounts.$inferSelect;
export type Activity = typeof activities.$inferSelect;
