import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name").notNull(),
  role: text("role"),
  avatarInitials: text("avatar_initials"),
  level: text("level").default("beginner"),
  levelProgress: integer("level_progress").default(0),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  displayName: true,
  role: true,
  avatarInitials: true,
});

// Task schema
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  projectName: text("project_name").notNull(),
  projectImageUrl: text("project_image_url"),
  difficulty: text("difficulty").notNull(), // beginner, intermediate, advanced
  estimatedHours: text("estimated_hours").notNull(),
  tags: text("tags").array(),
  link: text("link").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
});

// User contributions (completed tasks)
export const contributions = pgTable("contributions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  taskId: bigint("task_id", { mode: "number" }).notNull(),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
  pullRequestUrl: text("pull_request_url"),
  description: text("description"),
});

export const insertContributionSchema = createInsertSchema(contributions).extend({
  taskId: z.number().or(z.string().transform(val => BigInt(val))).transform(val => Number(val))
}).omit({
  id: true,
});

// Saved tasks (bookmarks)
export const savedTasks = pgTable("saved_tasks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  taskId: integer("task_id").notNull(),
  savedAt: timestamp("saved_at").defaultNow().notNull(),
});

export const insertSavedTaskSchema = createInsertSchema(savedTasks).omit({
  id: true,
  savedAt: true,
});

// Learning resources
export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  link: text("link").notNull(),
  category: text("category").notNull(),
});

export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
});

// Resume schema
export const resumes = pgTable("resumes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  personalInfo: json("personal_info").notNull(),
  skills: text("skills").array(),
  education: json("education").array(),
  experience: json("experience").array(),
  projects: json("projects").array(),
  certifications: json("certifications").array(),
  completionPercentage: integer("completion_percentage").default(0),
});

export const insertResumeSchema = createInsertSchema(resumes).omit({
  id: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

export type Contribution = typeof contributions.$inferSelect;
export type InsertContribution = z.infer<typeof insertContributionSchema>;

export type SavedTask = typeof savedTasks.$inferSelect;
export type InsertSavedTask = z.infer<typeof insertSavedTaskSchema>;

export type Resource = typeof resources.$inferSelect;
export type InsertResource = z.infer<typeof insertResourceSchema>;

export type Resume = typeof resumes.$inferSelect;
export type InsertResume = z.infer<typeof insertResumeSchema>;