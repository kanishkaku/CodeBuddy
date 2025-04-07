import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { 
  insertUserSchema, 
  insertTaskSchema,
  insertContributionSchema,
  insertSavedTaskSchema,
  insertResourceSchema,
  insertResumeSchema
} from "@shared/schema";
import { searchGitHubIssues, fetchGitHubIssueDetails } from "./githubService";
import { fetchGoodFirstIssues } from "./goodFirstIssueService";

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve the landing page for the root route
  app.get('/', (_req: Request, res: Response) => {
    res.sendFile('landing.html', { root: './client/public' });
  });
  
  // Special route to access the React app directly
  app.get('/app', (_req: Request, res: Response) => {
    res.sendFile('app.html', { root: './client/public' });
  });
  
  // Login page - serve our login HTML that redirects to the React app login route
  app.get('/login', (_req: Request, res: Response) => {
    res.sendFile('login.html', { root: './client/public' });
  });
  // Error handling middleware
  const handleError = (err: any, res: Response) => {
    console.error(err);
    if (err instanceof ZodError) {
      const validationError = fromZodError(err);
      return res.status(400).json({ error: validationError.message });
    }
    return res.status(500).json({ error: err.message || "Internal server error" });
  };

  // Authentication middleware to check for Supabase auth token
  const authenticateUser = async (req: Request, res: Response, next: Function) => {
    try {
      // Get the auth token from the request headers
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      
      // The actual validation would happen in the frontend with Supabase SDK
      // This is a simplified approach for the proof of concept
      // In a production environment, we would validate the JWT token here
      
      // For now, we'll just check if the token exists and pass it through
      // The frontend Supabase client handles the actual authentication
      next();
    } catch (err) {
      handleError(err, res);
    }
  };

  // Get current user with Supabase auth
  app.get("/api/current-user", authenticateUser, async (req, res) => {
    try {
      // Extract userId from the Authorization header
      // In a real implementation, we would fully decode and validate the JWT token
      // For this prototype, we accept the userId in a header or query param
      const userId = req.query.userId as string || req.headers['x-user-id'] as string;
      
      if (!userId) {
        return res.status(400).json({ error: "No user ID provided" });
      }
      
      // If userId is provided, get that user
      const user = await storage.getUser(parseInt(userId));
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (err) {
      handleError(err, res);
    }
  });

  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      
      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (err) {
      handleError(err, res);
    }
  });
  
  // Supabase auth user creation/sync
  app.post("/api/supabase-auth-user", async (req, res) => {
    try {
      const { id, email, user_metadata } = req.body;
      
      if (!id || !email) {
        return res.status(400).json({ error: "Missing required user information" });
      }
      
      // Check if user already exists
      let user = await storage.getUser(parseInt(id));
      
      if (!user) {
        // Create a new user
        const displayName = user_metadata?.name || email.split('@')[0] || 'User';
        const avatarInitials = displayName.substring(0, 2).toUpperCase();
        
        const userData = {
          id: parseInt(id),
          username: email.split('@')[0] || `user_${Date.now()}`,
          displayName: displayName,
          avatarInitials: avatarInitials,
          role: 'Student',
          level: 'beginner',
          levelProgress: 0,
          password: `supabase_${Date.now()}` // Dummy password for storage - authentication is handled by Supabase
        };
        
        user = await storage.createUser(userData);
        
        // Return user without password
        const { password, ...userWithoutPassword } = user;
        return res.status(201).json(userWithoutPassword);
      }
      
      // User exists, return existing user
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (err) {
      handleError(err, res);
    }
  });

  // Task routes
  app.get("/api/tasks", async (req, res) => {
    try {
      const { difficulty, tags, source, q } = req.query;
      
      // Check if we should fetch from GitHub or Good First Issues
      if (source === 'github') {
        console.log(`Fetching GitHub issues with difficulty: ${difficulty}, query: ${q}`);
        const githubTasks = await searchGitHubIssues(
          difficulty as string,
          q as string
        );
        return res.json(githubTasks);
      } else if (source === 'goodfirstissue') {
        console.log(`Fetching Good First Issues with language: ${difficulty}, tags: ${tags}`);
        const language = difficulty as string !== 'all' ? difficulty as string : undefined;
        const tagArray = tags ? (tags as string).split(',') : undefined;
        
        try {
          const goodFirstIssues = await fetchGoodFirstIssues(language, tagArray);
          return res.json(goodFirstIssues);
        } catch (error) {
          // Log the error but don't expose it to the client
          console.error(`Error fetching from GitHub API: ${error}`);
          
          // Return an empty array with a 200 status code instead of a 500 error
          // This allows the frontend to handle it gracefully
          return res.json([]);
        }
      }
      
      // Otherwise, use in-memory storage
      let tasks;
      if (difficulty) {
        tasks = await storage.getTasksByDifficulty(difficulty as string);
      } else if (tags) {
        const tagArray = (tags as string).split(',');
        tasks = await storage.getTasksByTags(tagArray);
      } else {
        tasks = await storage.getAllTasks();
      }
      
      res.json(tasks);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.get("/api/tasks/:id", async (req, res) => {
    try {
      const { source } = req.query;
      
      // Check if we should fetch from GitHub
      if (source === 'github') {
        const { owner, repo, issueNumber } = req.query;
        if (!owner || !repo || !issueNumber) {
          return res.status(400).json({ error: "Missing GitHub repository or issue information" });
        }
        
        console.log(`Fetching GitHub issue details: ${owner}/${repo}#${issueNumber}`);
        const githubTask = await fetchGitHubIssueDetails(
          owner as string,
          repo as string,
          parseInt(issueNumber as string)
        );
        
        if (!githubTask) {
          return res.status(404).json({ error: "GitHub issue not found" });
        }
        
        return res.json(githubTask);
      }
      
      // Otherwise, use in-memory storage
      const taskId = parseInt(req.params.id);
      const task = await storage.getTask(taskId);
      
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      
      res.json(task);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const taskData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(taskData);
      res.status(201).json(task);
    } catch (err) {
      handleError(err, res);
    }
  });

  // Contribution routes
  app.get("/api/users/:userId/contributions", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const contributions = await storage.getUserContributions(userId);
      res.json(contributions);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.post("/api/contributions", async (req, res) => {
    try {
      const contributionData = insertContributionSchema.parse(req.body);
      
      // Check if the task exists in our database
      let task = await storage.getTask(contributionData.taskId);
      
      // If this is a task from GitHub API and not in our database yet,
      // we need to add it to our database so it can be properly linked
      if (!task && contributionData.taskId > 1000000) {  // Using a large number as a heuristic for external IDs
        // Try to fetch any additional task data from the request
        const taskData = req.body.taskData || {};
        
        // Create a minimal task entry
        const newTask = {
          id: contributionData.taskId,
          title: taskData.title || "External GitHub Task",
          description: taskData.description || "A task from GitHub",
          projectName: taskData.projectName || "GitHub Project",
          projectImageUrl: taskData.projectImageUrl || null,
          difficulty: taskData.difficulty || "intermediate",
          estimatedHours: taskData.estimatedHours || "Unknown",
          tags: taskData.tags || ["github"],
          link: taskData.link || contributionData.pullRequestUrl || "https://github.com",
          createdAt: new Date()
        };
        
        // Add the task to our database
        await storage.createTaskWithId(newTask);
      }
      
      const contribution = await storage.createContribution(contributionData);
      res.status(201).json(contribution);
    } catch (err) {
      handleError(err, res);
    }
  });

  // Saved tasks routes
  app.get("/api/users/:userId/saved-tasks", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const savedTasks = await storage.getUserSavedTasks(userId);
      res.json(savedTasks);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.post("/api/saved-tasks", async (req, res) => {
    try {
      const savedTaskData = insertSavedTaskSchema.parse(req.body);
      const savedTask = await storage.saveTask(savedTaskData);
      res.status(201).json(savedTask);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.delete("/api/users/:userId/saved-tasks/:taskId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const taskId = parseInt(req.params.taskId);
      await storage.removeSavedTask(userId, taskId);
      res.status(204).send();
    } catch (err) {
      handleError(err, res);
    }
  });

  app.get("/api/users/:userId/saved-tasks/:taskId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const taskId = parseInt(req.params.taskId);
      const isSaved = await storage.isSavedTask(userId, taskId);
      res.json({ isSaved });
    } catch (err) {
      handleError(err, res);
    }
  });

  // Resource routes
  app.get("/api/resources", async (req, res) => {
    try {
      const { category } = req.query;
      
      let resources;
      if (category) {
        resources = await storage.getResourcesByCategory(category as string);
      } else {
        resources = await storage.getAllResources();
      }
      
      res.json(resources);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.get("/api/resources/:id", async (req, res) => {
    try {
      const resourceId = parseInt(req.params.id);
      const resource = await storage.getResource(resourceId);
      
      if (!resource) {
        return res.status(404).json({ error: "Resource not found" });
      }
      
      res.json(resource);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.post("/api/resources", async (req, res) => {
    try {
      const resourceData = insertResourceSchema.parse(req.body);
      const resource = await storage.createResource(resourceData);
      res.status(201).json(resource);
    } catch (err) {
      handleError(err, res);
    }
  });

  // Resume routes
  app.get("/api/users/:userId/resume", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const resume = await storage.getUserResume(userId);
      
      if (!resume) {
        return res.status(404).json({ error: "Resume not found" });
      }
      
      res.json(resume);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.post("/api/resumes", async (req, res) => {
    try {
      const resumeData = insertResumeSchema.parse(req.body);
      const resume = await storage.createResume(resumeData);
      res.status(201).json(resume);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.patch("/api/users/:userId/resume", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const resumeData = req.body;
      const resume = await storage.updateResume(userId, resumeData);
      
      if (!resume) {
        return res.status(404).json({ error: "Resume not found" });
      }
      
      res.json(resume);
    } catch (err) {
      handleError(err, res);
    }
  });

  // User stats - Get counts of contributions and saved tasks
  app.get("/api/users/:userId/stats", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      const contributions = await storage.getUserContributions(userId);
      const savedTasks = await storage.getUserSavedTasks(userId);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json({
        tasksCompleted: contributions.length,
        savedTasks: savedTasks.length,
        level: user.level,
        levelProgress: user.levelProgress
      });
    } catch (err) {
      handleError(err, res);
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
