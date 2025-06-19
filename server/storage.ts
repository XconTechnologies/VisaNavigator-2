import {
  users,
  studentProfiles,
  agentProfiles,
  universityProfiles,
  universityPrograms,
  applications,
  documents,
  tasks,
  commissions,
  type User,
  type UpsertUser,
  type StudentProfile,
  type AgentProfile,
  type UniversityProfile,
  type UniversityProgram,
  type Application,
  type Document,
  type Task,
  type Commission,
  type InsertStudentProfile,
  type InsertAgentProfile,
  type InsertUniversityProfile,
  type InsertUniversityProgram,
  type InsertApplication,
  type InsertDocument,
  type InsertTask,
  type InsertCommission,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, count, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Profile operations
  getStudentProfile(userId: string): Promise<StudentProfile | undefined>;
  createStudentProfile(profile: InsertStudentProfile): Promise<StudentProfile>;
  updateStudentProfile(userId: string, profile: Partial<InsertStudentProfile>): Promise<StudentProfile>;

  getAgentProfile(userId: string): Promise<AgentProfile | undefined>;
  createAgentProfile(profile: InsertAgentProfile): Promise<AgentProfile>;
  updateAgentProfile(userId: string, profile: Partial<InsertAgentProfile>): Promise<AgentProfile>;

  getUniversityProfile(userId: string): Promise<UniversityProfile | undefined>;
  createUniversityProfile(profile: InsertUniversityProfile): Promise<UniversityProfile>;
  updateUniversityProfile(userId: string, profile: Partial<InsertUniversityProfile>): Promise<UniversityProfile>;

  // University and program operations
  getAllUniversities(): Promise<UniversityProfile[]>;
  getUniversityPrograms(universityId: number): Promise<UniversityProgram[]>;
  createUniversityProgram(program: InsertUniversityProgram): Promise<UniversityProgram>;
  searchUniversities(filters: {
    country?: string;
    field?: string;
    budgetMin?: number;
    budgetMax?: number;
  }): Promise<(UniversityProfile & { programs: UniversityProgram[] })[]>;

  // Application operations
  getUserApplications(userId: string): Promise<(Application & { 
    university: UniversityProfile; 
    program: UniversityProgram;
  })[]>;
  getAgentApplications(agentId: string): Promise<(Application & { 
    student: User;
    university: UniversityProfile; 
    program: UniversityProgram;
  })[]>;
  getUniversityApplications(universityId: number): Promise<(Application & { 
    student: User;
    program: UniversityProgram;
  })[]>;
  createApplication(application: InsertApplication): Promise<Application>;
  updateApplication(id: number, application: Partial<InsertApplication>): Promise<Application>;

  // Document operations
  getUserDocuments(userId: string): Promise<Document[]>;
  getApplicationDocuments(applicationId: number): Promise<Document[]>;
  createDocument(document: InsertDocument): Promise<Document>;
  updateDocument(id: number, document: Partial<InsertDocument>): Promise<Document>;

  // Task operations
  getUserTasks(userId: string): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task>;

  // Commission operations
  getAgentCommissions(agentId: string): Promise<Commission[]>;
  createCommission(commission: InsertCommission): Promise<Commission>;
  updateCommission(id: number, commission: Partial<InsertCommission>): Promise<Commission>;

  // Analytics operations
  getStudentStats(userId: string): Promise<{
    totalApplications: number;
    offerLetters: number;
    pendingReviews: number;
    visaStatus: string;
  }>;
  getAgentStats(userId: string): Promise<{
    activeLeads: number;
    successRate: number;
    monthlyCommission: number;
    ranking: number;
  }>;
  getUniversityStats(universityId: number): Promise<{
    newApplications: number;
    offersSent: number;
    enrolledStudents: number;
    acceptanceRate: number;
  }>;
  getAdminStats(): Promise<{
    totalUsers: number;
    universities: number;
    activeApplications: number;
    monthlyRevenue: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Profile operations
  async getStudentProfile(userId: string): Promise<StudentProfile | undefined> {
    const [profile] = await db
      .select()
      .from(studentProfiles)
      .where(eq(studentProfiles.userId, userId));
    return profile;
  }

  async createStudentProfile(profile: InsertStudentProfile): Promise<StudentProfile> {
    const [newProfile] = await db
      .insert(studentProfiles)
      .values(profile)
      .returning();
    return newProfile;
  }

  async updateStudentProfile(userId: string, profile: Partial<InsertStudentProfile>): Promise<StudentProfile> {
    const [updatedProfile] = await db
      .update(studentProfiles)
      .set({ ...profile, updatedAt: new Date() })
      .where(eq(studentProfiles.userId, userId))
      .returning();
    return updatedProfile;
  }

  async getAgentProfile(userId: string): Promise<AgentProfile | undefined> {
    const [profile] = await db
      .select()
      .from(agentProfiles)
      .where(eq(agentProfiles.userId, userId));
    return profile;
  }

  async createAgentProfile(profile: InsertAgentProfile): Promise<AgentProfile> {
    const [newProfile] = await db
      .insert(agentProfiles)
      .values(profile)
      .returning();
    return newProfile;
  }

  async updateAgentProfile(userId: string, profile: Partial<InsertAgentProfile>): Promise<AgentProfile> {
    const [updatedProfile] = await db
      .update(agentProfiles)
      .set({ ...profile, updatedAt: new Date() })
      .where(eq(agentProfiles.userId, userId))
      .returning();
    return updatedProfile;
  }

  async getUniversityProfile(userId: string): Promise<UniversityProfile | undefined> {
    const [profile] = await db
      .select()
      .from(universityProfiles)
      .where(eq(universityProfiles.userId, userId));
    return profile;
  }

  async createUniversityProfile(profile: InsertUniversityProfile): Promise<UniversityProfile> {
    const [newProfile] = await db
      .insert(universityProfiles)
      .values(profile)
      .returning();
    return newProfile;
  }

  async updateUniversityProfile(userId: string, profile: Partial<InsertUniversityProfile>): Promise<UniversityProfile> {
    const [updatedProfile] = await db
      .update(universityProfiles)
      .set({ ...profile, updatedAt: new Date() })
      .where(eq(universityProfiles.userId, userId))
      .returning();
    return updatedProfile;
  }

  // University and program operations
  async getAllUniversities(): Promise<UniversityProfile[]> {
    return await db
      .select()
      .from(universityProfiles)
      .where(eq(universityProfiles.isActive, true));
  }

  async getUniversityPrograms(universityId: number): Promise<UniversityProgram[]> {
    return await db
      .select()
      .from(universityPrograms)
      .where(and(
        eq(universityPrograms.universityId, universityId),
        eq(universityPrograms.isActive, true)
      ));
  }

  async createUniversityProgram(program: InsertUniversityProgram): Promise<UniversityProgram> {
    const [newProgram] = await db
      .insert(universityPrograms)
      .values(program)
      .returning();
    return newProgram;
  }

  async searchUniversities(filters: {
    country?: string;
    field?: string;
    budgetMin?: number;
    budgetMax?: number;
  }): Promise<(UniversityProfile & { programs: UniversityProgram[] })[]> {
    const universities = await db.query.universityProfiles.findMany({
      where: (university, { eq, and }) => and(
        eq(university.isActive, true),
        filters.country ? eq(university.country, filters.country) : undefined
      ),
      with: {
        programs: {
          where: (program, { eq, and, gte, lte }) => and(
            eq(program.isActive, true),
            filters.field ? eq(program.field, filters.field) : undefined,
            filters.budgetMin ? gte(program.tuitionFee, filters.budgetMin) : undefined,
            filters.budgetMax ? lte(program.tuitionFee, filters.budgetMax) : undefined
          )
        }
      }
    });

    return universities as (UniversityProfile & { programs: UniversityProgram[] })[];
  }

  // Application operations
  async getUserApplications(userId: string): Promise<(Application & { 
    university: UniversityProfile; 
    program: UniversityProgram;
  })[]> {
    return await db.query.applications.findMany({
      where: eq(applications.studentId, userId),
      with: {
        university: true,
        program: true
      },
      orderBy: desc(applications.createdAt)
    }) as (Application & { university: UniversityProfile; program: UniversityProgram; })[];
  }

  async getAgentApplications(agentId: string): Promise<(Application & { 
    student: User;
    university: UniversityProfile; 
    program: UniversityProgram;
  })[]> {
    return await db.query.applications.findMany({
      where: eq(applications.agentId, agentId),
      with: {
        student: true,
        university: true,
        program: true
      },
      orderBy: desc(applications.updatedAt)
    }) as (Application & { student: User; university: UniversityProfile; program: UniversityProgram; })[];
  }

  async getUniversityApplications(universityId: number): Promise<(Application & { 
    student: User;
    program: UniversityProgram;
  })[]> {
    return await db.query.applications.findMany({
      where: eq(applications.universityId, universityId),
      with: {
        student: true,
        program: true
      },
      orderBy: desc(applications.createdAt)
    }) as (Application & { student: User; program: UniversityProgram; })[];
  }

  async createApplication(application: InsertApplication): Promise<Application> {
    const [newApplication] = await db
      .insert(applications)
      .values(application)
      .returning();
    return newApplication;
  }

  async updateApplication(id: number, application: Partial<InsertApplication>): Promise<Application> {
    const [updatedApplication] = await db
      .update(applications)
      .set({ ...application, updatedAt: new Date() })
      .where(eq(applications.id, id))
      .returning();
    return updatedApplication;
  }

  // Document operations
  async getUserDocuments(userId: string): Promise<Document[]> {
    return await db
      .select()
      .from(documents)
      .where(eq(documents.userId, userId))
      .orderBy(desc(documents.createdAt));
  }

  async getApplicationDocuments(applicationId: number): Promise<Document[]> {
    return await db
      .select()
      .from(documents)
      .where(eq(documents.applicationId, applicationId))
      .orderBy(desc(documents.createdAt));
  }

  async createDocument(document: InsertDocument): Promise<Document> {
    const [newDocument] = await db
      .insert(documents)
      .values(document)
      .returning();
    return newDocument;
  }

  async updateDocument(id: number, document: Partial<InsertDocument>): Promise<Document> {
    const [updatedDocument] = await db
      .update(documents)
      .set({ ...document, updatedAt: new Date() })
      .where(eq(documents.id, id))
      .returning();
    return updatedDocument;
  }

  // Task operations
  async getUserTasks(userId: string): Promise<Task[]> {
    return await db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, userId))
      .orderBy(desc(tasks.dueDate));
  }

  async createTask(task: InsertTask): Promise<Task> {
    const [newTask] = await db
      .insert(tasks)
      .values(task)
      .returning();
    return newTask;
  }

  async updateTask(id: number, task: Partial<InsertTask>): Promise<Task> {
    const [updatedTask] = await db
      .update(tasks)
      .set({ ...task, updatedAt: new Date() })
      .where(eq(tasks.id, id))
      .returning();
    return updatedTask;
  }

  // Commission operations
  async getAgentCommissions(agentId: string): Promise<Commission[]> {
    return await db
      .select()
      .from(commissions)
      .where(eq(commissions.agentId, agentId))
      .orderBy(desc(commissions.createdAt));
  }

  async createCommission(commission: InsertCommission): Promise<Commission> {
    const [newCommission] = await db
      .insert(commissions)
      .values(commission)
      .returning();
    return newCommission;
  }

  async updateCommission(id: number, commission: Partial<InsertCommission>): Promise<Commission> {
    const [updatedCommission] = await db
      .update(commissions)
      .set({ ...commission, updatedAt: new Date() })
      .where(eq(commissions.id, id))
      .returning();
    return updatedCommission;
  }

  // Analytics operations
  async getStudentStats(userId: string): Promise<{
    totalApplications: number;
    offerLetters: number;
    pendingReviews: number;
    visaStatus: string;
  }> {
    const [totalApps] = await db
      .select({ count: count() })
      .from(applications)
      .where(eq(applications.studentId, userId));

    const [offers] = await db
      .select({ count: count() })
      .from(applications)
      .where(and(
        eq(applications.studentId, userId),
        eq(applications.status, 'offer_received')
      ));

    const [pending] = await db
      .select({ count: count() })
      .from(applications)
      .where(and(
        eq(applications.studentId, userId),
        eq(applications.status, 'under_review')
      ));

    const [visaApp] = await db
      .select()
      .from(applications)
      .where(and(
        eq(applications.studentId, userId),
        sql`status IN ('visa_approved', 'visa_rejected', 'enrolled')`
      ))
      .orderBy(desc(applications.updatedAt))
      .limit(1);

    return {
      totalApplications: totalApps.count,
      offerLetters: offers.count,
      pendingReviews: pending.count,
      visaStatus: visaApp?.status === 'visa_approved' ? 'Approved' : 
                  visaApp?.status === 'visa_rejected' ? 'Rejected' : 'In Progress'
    };
  }

  async getAgentStats(userId: string): Promise<{
    activeLeads: number;
    successRate: number;
    monthlyCommission: number;
    ranking: number;
  }> {
    const [activeLeads] = await db
      .select({ count: count() })
      .from(applications)
      .where(and(
        eq(applications.agentId, userId),
        sql`status NOT IN ('enrolled', 'rejected')`
      ));

    const [totalApps] = await db
      .select({ count: count() })
      .from(applications)
      .where(eq(applications.agentId, userId));

    const [successfulApps] = await db
      .select({ count: count() })
      .from(applications)
      .where(and(
        eq(applications.agentId, userId),
        sql`status IN ('offer_received', 'enrolled')`
      ));

    const [monthlyCommissionResult] = await db
      .select({ 
        total: sql<number>`COALESCE(SUM(CAST(amount AS DECIMAL)), 0)` 
      })
      .from(commissions)
      .where(and(
        eq(commissions.agentId, userId),
        sql`created_at >= DATE_TRUNC('month', CURRENT_DATE)`
      ));

    const successRate = totalApps.count > 0 ? (successfulApps.count / totalApps.count) * 100 : 0;

    return {
      activeLeads: activeLeads.count,
      successRate: Math.round(successRate),
      monthlyCommission: Number(monthlyCommissionResult.total || 0),
      ranking: 3 // This would require more complex ranking logic
    };
  }

  async getUniversityStats(universityId: number): Promise<{
    newApplications: number;
    offersSent: number;
    enrolledStudents: number;
    acceptanceRate: number;
  }> {
    const [newApps] = await db
      .select({ count: count() })
      .from(applications)
      .where(and(
        eq(applications.universityId, universityId),
        eq(applications.status, 'submitted')
      ));

    const [offers] = await db
      .select({ count: count() })
      .from(applications)
      .where(and(
        eq(applications.universityId, universityId),
        eq(applications.status, 'offer_received')
      ));

    const [enrolled] = await db
      .select({ count: count() })
      .from(applications)
      .where(and(
        eq(applications.universityId, universityId),
        eq(applications.status, 'enrolled')
      ));

    const [totalApps] = await db
      .select({ count: count() })
      .from(applications)
      .where(eq(applications.universityId, universityId));

    const acceptanceRate = totalApps.count > 0 ? (offers.count / totalApps.count) * 100 : 0;

    return {
      newApplications: newApps.count,
      offersSent: offers.count,
      enrolledStudents: enrolled.count,
      acceptanceRate: Math.round(acceptanceRate)
    };
  }

  async getAdminStats(): Promise<{
    totalUsers: number;
    universities: number;
    activeApplications: number;
    monthlyRevenue: number;
  }> {
    const [totalUsers] = await db
      .select({ count: count() })
      .from(users);

    const [universities] = await db
      .select({ count: count() })
      .from(universityProfiles)
      .where(eq(universityProfiles.isActive, true));

    const [activeApps] = await db
      .select({ count: count() })
      .from(applications)
      .where(sql`status NOT IN ('enrolled', 'rejected')`);

    const [monthlyRevenue] = await db
      .select({ 
        total: sql<number>`COALESCE(SUM(CAST(amount AS DECIMAL)), 0)` 
      })
      .from(commissions)
      .where(sql`created_at >= DATE_TRUNC('month', CURRENT_DATE)`);

    return {
      totalUsers: totalUsers.count,
      universities: universities.count,
      activeApplications: activeApps.count,
      monthlyRevenue: Number(monthlyRevenue.total || 0)
    };
  }
}

export const storage = new DatabaseStorage();
