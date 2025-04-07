import {
  users, tasks, contributions, savedTasks, resources, resumes,
  type User, type InsertUser,
  type Task, type InsertTask,
  type Contribution, type InsertContribution,
  type SavedTask, type InsertSavedTask,
  type Resource, type InsertResource,
  type Resume, type InsertResume
} from "@shared/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { db } from "./db";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;

  // Task operations
  getAllTasks(): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  getTasksByDifficulty(difficulty: string): Promise<Task[]>;
  getTasksByTags(tags: string[]): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  createTaskWithId(task: Task): Promise<Task>;

  // Contribution operations
  getUserContributions(userId: number): Promise<(Contribution & { task?: Task })[]>;
  createContribution(contribution: InsertContribution): Promise<Contribution>;
  getContribution(id: number): Promise<Contribution | undefined>;

  // Saved tasks operations
  getUserSavedTasks(userId: number): Promise<(SavedTask & { task: Task })[]>;
  saveTask(savedTask: InsertSavedTask): Promise<SavedTask>;
  removeSavedTask(userId: number, taskId: number): Promise<void>;
  isSavedTask(userId: number, taskId: number): Promise<boolean>;

  // Resource operations
  getAllResources(): Promise<Resource[]>;
  getResourcesByCategory(category: string): Promise<Resource[]>;
  getResource(id: number): Promise<Resource | undefined>;
  createResource(resource: InsertResource): Promise<Resource>;

  // Resume operations
  getUserResume(userId: number): Promise<Resume | undefined>;
  createResume(resume: InsertResume): Promise<Resume>;
  updateResume(userId: number, resume: Partial<Resume>): Promise<Resume | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        level: "beginner",
        levelProgress: 0,
        role: insertUser.role || null,
        avatarInitials: insertUser.avatarInitials || null
      })
      .returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return updatedUser || undefined;
  }

  async getAllTasks(): Promise<Task[]> {
    return await db.select().from(tasks);
  }

  async getTask(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task || undefined;
  }

  async getTasksByDifficulty(difficulty: string): Promise<Task[]> {
    return await db.select().from(tasks).where(eq(tasks.difficulty, difficulty));
  }

  async getTasksByTags(tags: string[]): Promise<Task[]> {
    // Using SQL contains operator for array search
    const results = await db.select().from(tasks)
      .where(sql`${tasks.tags} && ${tags}`);
    return results;
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const [task] = await db
      .insert(tasks)
      .values({
        ...insertTask,
        projectImageUrl: insertTask.projectImageUrl || null,
        tags: insertTask.tags || null,
        createdAt: new Date()
      })
      .returning();
    return task;
  }

  async createTaskWithId(task: Task): Promise<Task> {
    // Check if task already exists
    const existingTask = await this.getTask(task.id);
    if (existingTask) {
      return existingTask;
    }
    
    // Insert the task with the specified ID
    const [newTask] = await db
      .insert(tasks)
      .values({
        ...task,
        projectImageUrl: task.projectImageUrl || null,
        tags: task.tags || null,
        createdAt: task.createdAt || new Date()
      })
      .returning();
    return newTask;
  }

  async getUserContributions(userId: number): Promise<(Contribution & { task?: Task })[]> {
    const userContributions = await db
      .select({
        contribution: contributions,
        task: tasks
      })
      .from(contributions)
      .leftJoin(tasks, eq(contributions.taskId, tasks.id))
      .where(eq(contributions.userId, userId))
      .orderBy(desc(contributions.completedAt));
    
    return userContributions.map(({ contribution, task }) => ({
      ...contribution,
      task: task || undefined
    }));
  }

  async createContribution(insertContribution: InsertContribution): Promise<Contribution> {
    const [contribution] = await db
      .insert(contributions)
      .values({
        ...insertContribution,
        description: insertContribution.description || null,
        pullRequestUrl: insertContribution.pullRequestUrl || null
      })
      .returning();
    return contribution;
  }

  async getContribution(id: number): Promise<Contribution | undefined> {
    const [contribution] = await db
      .select()
      .from(contributions)
      .where(eq(contributions.id, id));
    return contribution || undefined;
  }

  async getUserSavedTasks(userId: number): Promise<(SavedTask & { task: Task })[]> {
    const userSavedTasks = await db
      .select({
        savedTask: savedTasks,
        task: tasks
      })
      .from(savedTasks)
      .innerJoin(tasks, eq(savedTasks.taskId, tasks.id))
      .where(eq(savedTasks.userId, userId))
      .orderBy(desc(savedTasks.savedAt));
    
    return userSavedTasks.map(({ savedTask, task }) => ({
      ...savedTask,
      task
    }));
  }

  async saveTask(insertSavedTask: InsertSavedTask): Promise<SavedTask> {
    // Check if already saved
    const isSaved = await this.isSavedTask(insertSavedTask.userId, insertSavedTask.taskId);
    if (isSaved) {
      // Return the existing saved task
      const [existingSavedTask] = await db
        .select()
        .from(savedTasks)
        .where(and(
          eq(savedTasks.userId, insertSavedTask.userId),
          eq(savedTasks.taskId, insertSavedTask.taskId)
        ));
      return existingSavedTask;
    }
    
    // Insert the new saved task
    const [savedTask] = await db
      .insert(savedTasks)
      .values(insertSavedTask)
      .returning();
    return savedTask;
  }

  async removeSavedTask(userId: number, taskId: number): Promise<void> {
    await db
      .delete(savedTasks)
      .where(and(
        eq(savedTasks.userId, userId),
        eq(savedTasks.taskId, taskId)
      ));
  }

  async isSavedTask(userId: number, taskId: number): Promise<boolean> {
    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(savedTasks)
      .where(and(
        eq(savedTasks.userId, userId),
        eq(savedTasks.taskId, taskId)
      ));
    
    return result.count > 0;
  }

  async getAllResources(): Promise<Resource[]> {
    return await db.select().from(resources);
  }

  async getResourcesByCategory(category: string): Promise<Resource[]> {
    return await db
      .select()
      .from(resources)
      .where(eq(resources.category, category));
  }

  async getResource(id: number): Promise<Resource | undefined> {
    const [resource] = await db
      .select()
      .from(resources)
      .where(eq(resources.id, id));
    return resource || undefined;
  }

  async createResource(insertResource: InsertResource): Promise<Resource> {
    const [resource] = await db
      .insert(resources)
      .values({
        ...insertResource,
        imageUrl: insertResource.imageUrl || null
      })
      .returning();
    return resource;
  }

  async getUserResume(userId: number): Promise<Resume | undefined> {
    const [resume] = await db
      .select()
      .from(resumes)
      .where(eq(resumes.userId, userId));
    return resume || undefined;
  }

  async createResume(insertResume: InsertResume): Promise<Resume> {
    const [resume] = await db
      .insert(resumes)
      .values({
        ...insertResume,
        skills: insertResume.skills || null,
        education: insertResume.education || null,
        experience: insertResume.experience || null,
        projects: insertResume.projects || null,
        certifications: insertResume.certifications || null,
        completionPercentage: insertResume.completionPercentage || 0
      })
      .returning();
    return resume;
  }

  async updateResume(userId: number, resumeData: Partial<Resume>): Promise<Resume | undefined> {
    const [updatedResume] = await db
      .update(resumes)
      .set(resumeData)
      .where(eq(resumes.userId, userId))
      .returning();
    return updatedResume || undefined;
  }
}

// Use database storage instead of memory storage
export const storage = new DatabaseStorage();