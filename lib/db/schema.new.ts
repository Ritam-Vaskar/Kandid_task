import { pgTable, text, integer, timestamp, boolean, decimal } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { relations, InferModel } from "drizzle-orm";

// Auth tables required by better-auth
export const users = pgTable("user", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  email: text("email").unique().notNull(),
  name: text("name"),
  image: text("image"),
  emailVerified: boolean("emailVerified").notNull().default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const campaigns = pgTable("campaign", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").notNull().default("draft"),
  totalLeads: integer("total_leads").notNull().default(0),
  requestSent: integer("request_sent").notNull().default(0),
  requestAccepted: integer("request_accepted").notNull().default(0),
  requestReplied: integer("request_replied").notNull().default(0),
  conversionRate: decimal("conversion_rate").notNull().default("0"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const leads = pgTable("lead", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  name: text("name").notNull(),
  email: text("email"),
  company: text("company"),
  status: text("status").notNull().default("pending"),
  campaignId: text("campaign_id").notNull().references(() => campaigns.id, { onDelete: "cascade" }),
  lastContactDate: timestamp("last_contact_date"),
  notes: text("notes"),
  linkedinUrl: text("linkedin_url"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

// Relations
export const campaignsRelations = relations(campaigns, ({ one, many }) => ({
  user: one(users, {
    fields: [campaigns.userId],
    references: [users.id],
  }),
  leads: many(leads),
}));

export const leadsRelations = relations(leads, ({ one }) => ({
  campaign: one(campaigns, {
    fields: [leads.campaignId],
    references: [campaigns.id],
  }),
}));

// Types
export type User = typeof users.$inferSelect;
export type Campaign = typeof campaigns.$inferSelect;
export type Lead = typeof leads.$inferSelect;

export type NewUser = typeof users.$inferInsert;
export type NewCampaign = typeof campaigns.$inferInsert;
export type NewLead = typeof leads.$inferInsert;
