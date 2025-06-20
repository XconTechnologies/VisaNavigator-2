import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertStudentProfileSchema,
  insertAgentProfileSchema,
  insertUniversityProfileSchema,
  insertUniversityProgramSchema,
  insertApplicationSchema,
  insertDocumentSchema,
  insertTaskSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Get user profile based on role
      let profile = null;
      if (user.role === 'student') {
        profile = await storage.getStudentProfile(userId);
      } else if (user.role === 'agent') {
        profile = await storage.getAgentProfile(userId);
      } else if (user.role === 'university') {
        profile = await storage.getUniversityProfile(userId);
      }

      res.json({ ...user, profile });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Update user role
  app.post('/api/auth/user/role', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { role } = req.body;
      
      if (!["student", "agent", "university", "admin"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const updatedUser = await storage.upsertUser({
        ...user,
        role: role as "student" | "agent" | "university" | "admin"
      });

      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).json({ message: "Failed to update user role" });
    }
  });

  // Profile routes
  app.post('/api/profiles/student', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profileData = insertStudentProfileSchema.parse({
        ...req.body,
        userId
      });
      
      const profile = await storage.createStudentProfile(profileData);
      res.json(profile);
    } catch (error) {
      console.error("Error creating student profile:", error);
      res.status(500).json({ message: "Failed to create profile" });
    }
  });

  app.put('/api/profiles/student', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profileData = insertStudentProfileSchema.partial().parse(req.body);
      
      const profile = await storage.updateStudentProfile(userId, profileData);
      res.json(profile);
    } catch (error) {
      console.error("Error updating student profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  app.post('/api/profiles/agent', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profileData = insertAgentProfileSchema.parse({
        ...req.body,
        userId
      });
      
      const profile = await storage.createAgentProfile(profileData);
      res.json(profile);
    } catch (error) {
      console.error("Error creating agent profile:", error);
      res.status(500).json({ message: "Failed to create profile" });
    }
  });

  app.post('/api/profiles/university', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profileData = insertUniversityProfileSchema.parse({
        ...req.body,
        userId
      });
      
      const profile = await storage.createUniversityProfile(profileData);
      res.json(profile);
    } catch (error) {
      console.error("Error creating university profile:", error);
      res.status(500).json({ message: "Failed to create profile" });
    }
  });

  // University and program routes
  app.get('/api/universities', async (req, res) => {
    try {
      const universities = await storage.getAllUniversities();
      res.json(universities);
    } catch (error) {
      console.error("Error fetching universities:", error);
      res.status(500).json({ message: "Failed to fetch universities" });
    }
  });

  app.get('/api/universities', async (req, res) => {
    try {
      const universities = await storage.getAllUniversities();
      res.json(universities);
    } catch (error) {
      console.error("Error fetching universities:", error);
      res.status(500).json({ message: "Failed to fetch universities" });
    }
  });

  app.get('/api/programs/:universityId', async (req, res) => {
    try {
      const universityId = parseInt(req.params.universityId);
      if (isNaN(universityId)) {
        return res.status(400).json({ message: "Invalid university ID" });
      }
      const programs = await storage.getUniversityPrograms(universityId);
      res.json(programs);
    } catch (error) {
      console.error("Error fetching programs:", error);
      res.status(500).json({ message: "Failed to fetch programs" });
    }
  });

  app.get('/api/universities/search', async (req, res) => {
    try {
      const { country, field, budgetMin, budgetMax } = req.query;
      const filters = {
        country: country as string,
        field: field as string,
        budgetMin: budgetMin ? parseInt(budgetMin as string) : undefined,
        budgetMax: budgetMax ? parseInt(budgetMax as string) : undefined,
      };
      
      const universities = await storage.searchUniversities(filters);
      res.json(universities);
    } catch (error) {
      console.error("Error searching universities:", error);
      res.status(500).json({ message: "Failed to search universities" });
    }
  });

  app.get('/api/universities/:id/programs', async (req, res) => {
    try {
      const universityId = parseInt(req.params.id);
      const programs = await storage.getUniversityPrograms(universityId);
      res.json(programs);
    } catch (error) {
      console.error("Error fetching programs:", error);
      res.status(500).json({ message: "Failed to fetch programs" });
    }
  });

  app.post('/api/universities/:id/programs', isAuthenticated, async (req: any, res) => {
    try {
      const universityId = parseInt(req.params.id);
      const programData = insertUniversityProgramSchema.parse({
        ...req.body,
        universityId
      });
      
      const program = await storage.createUniversityProgram(programData);
      res.json(program);
    } catch (error) {
      console.error("Error creating program:", error);
      res.status(500).json({ message: "Failed to create program" });
    }
  });

  // Application routes
  app.get('/api/applications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      let applications;
      if (user.role === 'student') {
        applications = await storage.getUserApplications(userId);
      } else if (user.role === 'agent') {
        applications = await storage.getAgentApplications(userId);
      } else if (user.role === 'university') {
        const profile = await storage.getUniversityProfile(userId);
        if (profile) {
          applications = await storage.getUniversityApplications(profile.id);
        }
      }

      res.json(applications || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  app.post('/api/applications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const applicationData = insertApplicationSchema.parse({
        ...req.body,
        studentId: userId
      });
      
      const application = await storage.createApplication(applicationData);
      res.json(application);
    } catch (error) {
      console.error("Error creating application:", error);
      res.status(500).json({ message: "Failed to create application" });
    }
  });

  app.put('/api/applications/:id', isAuthenticated, async (req: any, res) => {
    try {
      const applicationId = parseInt(req.params.id);
      const applicationData = insertApplicationSchema.partial().parse(req.body);
      
      const application = await storage.updateApplication(applicationId, applicationData);
      res.json(application);
    } catch (error) {
      console.error("Error updating application:", error);
      res.status(500).json({ message: "Failed to update application" });
    }
  });

  // Document routes
  app.get('/api/documents', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const documents = await storage.getUserDocuments(userId);
      res.json(documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  app.post('/api/documents', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const documentData = insertDocumentSchema.parse({
        ...req.body,
        userId
      });
      
      const document = await storage.createDocument(documentData);
      res.json(document);
    } catch (error) {
      console.error("Error creating document:", error);
      res.status(500).json({ message: "Failed to create document" });
    }
  });

  // Task routes
  app.get('/api/tasks', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const tasks = await storage.getUserTasks(userId);
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.post('/api/tasks', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const taskData = insertTaskSchema.parse({
        ...req.body,
        userId
      });
      
      const task = await storage.createTask(taskData);
      res.json(task);
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(500).json({ message: "Failed to create task" });
    }
  });

  app.put('/api/tasks/:id', isAuthenticated, async (req: any, res) => {
    try {
      const taskId = parseInt(req.params.id);
      const taskData = insertTaskSchema.partial().parse(req.body);
      
      const task = await storage.updateTask(taskId, taskData);
      res.json(task);
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json({ message: "Failed to update task" });
    }
  });

  // Statistics routes
  app.get('/api/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      let stats;
      if (user.role === 'student') {
        stats = await storage.getStudentStats(userId);
      } else if (user.role === 'agent') {
        stats = await storage.getAgentStats(userId);
      } else if (user.role === 'university') {
        const profile = await storage.getUniversityProfile(userId);
        if (profile) {
          stats = await storage.getUniversityStats(profile.id);
        }
      } else if (user.role === 'admin') {
        stats = await storage.getAdminStats();
      }

      res.json(stats || {});
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Commission routes (for agents)
  app.get('/api/commissions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const commissions = await storage.getAgentCommissions(userId);
      res.json(commissions);
    } catch (error) {
      console.error("Error fetching commissions:", error);
      res.status(500).json({ message: "Failed to fetch commissions" });
    }
  });

  // Role switching route
  app.post('/api/switch-role', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { role } = req.body;
      
      if (!['student', 'agent', 'university', 'admin'].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      const updatedUser = await storage.upsertUser({
        id: userId,
        role
      });

      res.json(updatedUser);
    } catch (error) {
      console.error("Error switching role:", error);
      res.status(500).json({ message: "Failed to switch role" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
