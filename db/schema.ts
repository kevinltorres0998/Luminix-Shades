import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const adminUsers = sqliteTable("admin_users", {
  id: text("id").primaryKey(), email: text("email").notNull().unique(), fullName: text("full_name").notNull(),
  passwordHash: text("password_hash").notNull(), passwordSalt: text("password_salt").notNull(), role: text("role").notNull().default("admin"),
  createdAt: text("created_at").notNull(), lastLoginAt: text("last_login_at"), disabledAt: text("disabled_at"),
});
export const adminSessions = sqliteTable("admin_sessions", { id: text("id").primaryKey(), userId: text("user_id").notNull(), tokenHash: text("token_hash").notNull().unique(), createdAt: text("created_at").notNull(), expiresAt: text("expires_at").notNull() });
export const adminInvites = sqliteTable("admin_invites", { id: text("id").primaryKey(), email: text("email").notNull(), tokenHash: text("token_hash").notNull().unique(), invitedBy: text("invited_by").notNull(), createdAt: text("created_at").notNull(), expiresAt: text("expires_at").notNull(), acceptedAt: text("accepted_at") });
export const adminLoginAttempts = sqliteTable("admin_login_attempts", { key: text("key").primaryKey(), attempts: integer("attempts").notNull().default(0), windowStartedAt: text("window_started_at").notNull() });
export const marketingSubscribers = sqliteTable("marketing_subscribers", {
  id: text("id").primaryKey(), email: text("email").notNull().unique(), firstName: text("first_name").notNull(),
  status: text("status").notNull().default("subscribed"), source: text("source").notNull().default("private-list"),
  createdAt: text("created_at").notNull(), updatedAt: text("updated_at").notNull(),
});
