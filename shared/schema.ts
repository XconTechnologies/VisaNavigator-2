import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  decimal,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table - required for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);

// User roles enum
export const userRoleEnum = pgEnum("user_role", ["student", "agent", "university", "admin"]);

// Application status enum
export const applicationStatusEnum = pgEnum("application_status", [
  "draft",
  "submitted",
  "under_review",
  "interview_scheduled",
  "offer_received",
  "rejected",
  "enrolled",
  "visa_approved",
  "visa_rejected"
]);

// Document type enum
export const documentTypeEnum = pgEnum("document_type", [
  "passport",
  "academic_transcripts",
  "ielts_toefl",
  "statement_of_purpose",
  "recommendation_letter",
  "cv_resume",
  "financial_documents",
  "other"
]);

// User storage table - required for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: userRoleEnum("role").default("student"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Student profiles
export const studentProfiles = pgTable("student_profiles", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  dateOfBirth: timestamp("date_of_birth"),
  nationality: varchar("nationality"),
  phoneNumber: varchar("phone_number"),
  address: text("address"),
  gpa: decimal("gpa", { precision: 3, scale: 2 }),
  ieltsScore: decimal("ielts_score", { precision: 3, scale: 1 }),
  toeflScore: integer("toefl_score"),
  preferredCountries: text("preferred_countries").array(),
  preferredFields: text("preferred_fields").array(),
  budgetMin: integer("budget_min"),
  budgetMax: integer("budget_max"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Agent profiles
export const agentProfiles = pgTable("agent_profiles", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  companyName: varchar("company_name"),
  licenseNumber: varchar("license_number"),
  phoneNumber: varchar("phone_number"),
  address: text("address"),
  specializations: text("specializations").array(),
  commissionRate: decimal("commission_rate", { precision: 5, scale: 2 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// University profiles
export const universityProfiles = pgTable("university_profiles", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  universityName: varchar("university_name").notNull(),
  country: varchar("country").notNull(),
  city: varchar("city"),
  address: text("address"),
  website: varchar("website"),
  ranking: integer("ranking"),
  description: text("description"),
  logoUrl: varchar("logo_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// University programs
export const universityPrograms = pgTable("university_programs", {
  id: serial("id").primaryKey(),
  universityId: integer("university_id").references(() => universityProfiles.id).notNull(),
  programName: varchar("program_name").notNull(),
  degree: varchar("degree").notNull(), // Bachelor, Master, PhD
  field: varchar("field").notNull(),
  duration: integer("duration"), // in months
  tuitionFee: integer("tuition_fee"),
  currency: varchar("currency").default("USD"),
  requirements: text("requirements"),
  applicationDeadline: timestamp("application_deadline"),
  startDate: timestamp("start_date"),
  scholarshipAvailable: boolean("scholarship_available").default(false),
  scholarshipAmount: integer("scholarship_amount"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Applications
export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  studentId: varchar("student_id").references(() => users.id).notNull(),
  agentId: varchar("agent_id").references(() => users.id),
  universityId: integer("university_id").references(() => universityProfiles.id).notNull(),
  programId: integer("program_id").references(() => universityPrograms.id).notNull(),
  status: applicationStatusEnum("status").default("draft"),
  submittedAt: timestamp("submitted_at"),
  reviewedAt: timestamp("reviewed_at"),
  interviewDate: timestamp("interview_date"),
  offerDate: timestamp("offer_date"),
  enrollmentDate: timestamp("enrollment_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Documents
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  applicationId: integer("application_id").references(() => applications.id),
  documentType: documentTypeEnum("document_type").notNull(),
  fileName: varchar("file_name").notNull(),
  fileUrl: varchar("file_url").notNull(),
  fileSize: integer("file_size"),
  mimeType: varchar("mime_type"),
  isVerified: boolean("is_verified").default(false),
  verifiedBy: varchar("verified_by").references(() => users.id),
  verifiedAt: timestamp("verified_at"),
  expiryDate: timestamp("expiry_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tasks
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  applicationId: integer("application_id").references(() => applications.id),
  title: varchar("title").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date"),
  isCompleted: boolean("is_completed").default(false),
  completedAt: timestamp("completed_at"),
  priority: varchar("priority").default("medium"), // low, medium, high
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Commissions
export const commissions = pgTable("commissions", {
  id: serial("id").primaryKey(),
  agentId: varchar("agent_id").references(() => users.id).notNull(),
  applicationId: integer("application_id").references(() => applications.id).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency").default("USD"),
  status: varchar("status").default("pending"), // pending, paid, cancelled
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  studentProfile: one(studentProfiles, {
    fields: [users.id],
    references: [studentProfiles.userId],
  }),
  agentProfile: one(agentProfiles, {
    fields: [users.id],
    references: [agentProfiles.userId],
  }),
  universityProfile: one(universityProfiles, {
    fields: [users.id],
    references: [universityProfiles.userId],
  }),
  applications: many(applications),
  documents: many(documents),
  tasks: many(tasks),
  commissions: many(commissions),
}));

export const studentProfilesRelations = relations(studentProfiles, ({ one }) => ({
  user: one(users, {
    fields: [studentProfiles.userId],
    references: [users.id],
  }),
}));

export const agentProfilesRelations = relations(agentProfiles, ({ one }) => ({
  user: one(users, {
    fields: [agentProfiles.userId],
    references: [users.id],
  }),
}));

export const universityProfilesRelations = relations(universityProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [universityProfiles.userId],
    references: [users.id],
  }),
  programs: many(universityPrograms),
  applications: many(applications),
}));

export const universityProgramsRelations = relations(universityPrograms, ({ one, many }) => ({
  university: one(universityProfiles, {
    fields: [universityPrograms.universityId],
    references: [universityProfiles.id],
  }),
  applications: many(applications),
}));

export const applicationsRelations = relations(applications, ({ one, many }) => ({
  student: one(users, {
    fields: [applications.studentId],
    references: [users.id],
  }),
  agent: one(users, {
    fields: [applications.agentId],
    references: [users.id],
  }),
  university: one(universityProfiles, {
    fields: [applications.universityId],
    references: [universityProfiles.id],
  }),
  program: one(universityPrograms, {
    fields: [applications.programId],
    references: [universityPrograms.id],
  }),
  documents: many(documents),
  tasks: many(tasks),
  commissions: many(commissions),
}));

export const documentsRelations = relations(documents, ({ one }) => ({
  user: one(users, {
    fields: [documents.userId],
    references: [users.id],
  }),
  application: one(applications, {
    fields: [documents.applicationId],
    references: [applications.id],
  }),
  verifier: one(users, {
    fields: [documents.verifiedBy],
    references: [users.id],
  }),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
  application: one(applications, {
    fields: [tasks.applicationId],
    references: [applications.id],
  }),
}));

export const commissionsRelations = relations(commissions, ({ one }) => ({
  agent: one(users, {
    fields: [commissions.agentId],
    references: [users.id],
  }),
  application: one(applications, {
    fields: [commissions.applicationId],
    references: [applications.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertStudentProfileSchema = createInsertSchema(studentProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAgentProfileSchema = createInsertSchema(agentProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUniversityProfileSchema = createInsertSchema(universityProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUniversityProgramSchema = createInsertSchema(universityPrograms).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCommissionSchema = createInsertSchema(commissions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type StudentProfile = typeof studentProfiles.$inferSelect;
export type AgentProfile = typeof agentProfiles.$inferSelect;
export type UniversityProfile = typeof universityProfiles.$inferSelect;
export type UniversityProgram = typeof universityPrograms.$inferSelect;
export type Application = typeof applications.$inferSelect;
export type Document = typeof documents.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type Commission = typeof commissions.$inferSelect;

export type InsertStudentProfile = z.infer<typeof insertStudentProfileSchema>;
export type InsertAgentProfile = z.infer<typeof insertAgentProfileSchema>;
export type InsertUniversityProfile = z.infer<typeof insertUniversityProfileSchema>;
export type InsertUniversityProgram = z.infer<typeof insertUniversityProgramSchema>;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type InsertCommission = z.infer<typeof insertCommissionSchema>;
