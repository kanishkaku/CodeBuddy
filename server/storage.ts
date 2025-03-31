import {
  users, tasks, contributions, savedTasks, resources, resumes,
  type User, type InsertUser,
  type Task, type InsertTask,
  type Contribution, type InsertContribution,
  type SavedTask, type InsertSavedTask,
  type Resource, type InsertResource,
  type Resume, type InsertResume
} from "@shared/schema";

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tasks: Map<number, Task>;
  private contributions: Map<number, Contribution>;
  private savedTasks: Map<number, SavedTask>;
  private resources: Map<number, Resource>;
  private resumes: Map<number, Resume>;

  private userIdCounter: number;
  private taskIdCounter: number;
  private contributionIdCounter: number;
  private savedTaskIdCounter: number;
  private resourceIdCounter: number;
  private resumeIdCounter: number;

  constructor() {
    this.users = new Map();
    this.tasks = new Map();
    this.contributions = new Map();
    this.savedTasks = new Map();
    this.resources = new Map();
    this.resumes = new Map();

    this.userIdCounter = 1;
    this.taskIdCounter = 1;
    this.contributionIdCounter = 1;
    this.savedTaskIdCounter = 1;
    this.resourceIdCounter = 1;
    this.resumeIdCounter = 1;

    // Initialize with some sample data
    this.initializeSampleData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id, level: "beginner", levelProgress: 0 };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Task operations
  async getAllTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async getTasksByDifficulty(difficulty: string): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(
      (task) => task.difficulty === difficulty,
    );
  }

  async getTasksByTags(tags: string[]): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(
      (task) => task.tags?.some(tag => tags.includes(tag))
    );
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.taskIdCounter++;
    const task: Task = { ...insertTask, id };
    this.tasks.set(id, task);
    return task;
  }
  
  // Special method to create a task with a specific ID (for external tasks)
  async createTaskWithId(task: Task): Promise<Task> {
    this.tasks.set(task.id, task);
    // Update task counter if needed
    if (task.id >= this.taskIdCounter) {
      this.taskIdCounter = task.id + 1;
    }
    return task;
  }

  // Contribution operations
  async getUserContributions(userId: number): Promise<(Contribution & { task?: Task })[]> {
    const userContributions = Array.from(this.contributions.values()).filter(
      (contribution) => contribution.userId === userId,
    );
    
    return userContributions.map(contribution => {
      const task = this.tasks.get(contribution.taskId);
      return { 
        ...contribution, 
        task: task || undefined 
      };
    });
  }

  async createContribution(insertContribution: InsertContribution): Promise<Contribution> {
    const id = this.contributionIdCounter++;
    const now = new Date();
    const contribution: Contribution = { ...insertContribution, id, completedAt: now };
    this.contributions.set(id, contribution);
    return contribution;
  }

  async getContribution(id: number): Promise<Contribution | undefined> {
    return this.contributions.get(id);
  }

  // Saved tasks operations
  async getUserSavedTasks(userId: number): Promise<(SavedTask & { task: Task })[]> {
    const userSavedTasks = Array.from(this.savedTasks.values()).filter(
      (savedTask) => savedTask.userId === userId,
    );
    
    return userSavedTasks.map(savedTask => {
      const task = this.tasks.get(savedTask.taskId)!;
      return { ...savedTask, task };
    });
  }

  async saveTask(insertSavedTask: InsertSavedTask): Promise<SavedTask> {
    const id = this.savedTaskIdCounter++;
    const now = new Date();
    const savedTask: SavedTask = { ...insertSavedTask, id, savedAt: now };
    this.savedTasks.set(id, savedTask);
    return savedTask;
  }

  async removeSavedTask(userId: number, taskId: number): Promise<void> {
    const savedTaskEntry = Array.from(this.savedTasks.entries()).find(
      ([_, savedTask]) => savedTask.userId === userId && savedTask.taskId === taskId
    );
    
    if (savedTaskEntry) {
      this.savedTasks.delete(savedTaskEntry[0]);
    }
  }

  async isSavedTask(userId: number, taskId: number): Promise<boolean> {
    return Array.from(this.savedTasks.values()).some(
      (savedTask) => savedTask.userId === userId && savedTask.taskId === taskId
    );
  }

  // Resource operations
  async getAllResources(): Promise<Resource[]> {
    return Array.from(this.resources.values());
  }

  async getResourcesByCategory(category: string): Promise<Resource[]> {
    return Array.from(this.resources.values()).filter(
      (resource) => resource.category === category,
    );
  }

  async getResource(id: number): Promise<Resource | undefined> {
    return this.resources.get(id);
  }

  async createResource(insertResource: InsertResource): Promise<Resource> {
    const id = this.resourceIdCounter++;
    const resource: Resource = { ...insertResource, id };
    this.resources.set(id, resource);
    return resource;
  }

  // Resume operations
  async getUserResume(userId: number): Promise<Resume | undefined> {
    return Array.from(this.resumes.values()).find(
      (resume) => resume.userId === userId
    );
  }

  async createResume(insertResume: InsertResume): Promise<Resume> {
    const id = this.resumeIdCounter++;
    const resume: Resume = { ...insertResume, id };
    this.resumes.set(id, resume);
    return resume;
  }

  async updateResume(userId: number, resumeData: Partial<Resume>): Promise<Resume | undefined> {
    const resume = Array.from(this.resumes.values()).find(
      (resume) => resume.userId === userId
    );
    
    if (!resume) return undefined;

    const updatedResume = { ...resume, ...resumeData };
    this.resumes.set(resume.id, updatedResume);
    return updatedResume;
  }

  // Initialize with sample data
  private initializeSampleData() {
    // Sample tasks
    const sampleTasks: InsertTask[] = [
      {
        title: "Fix documentation examples for <Link> component",
        description: "Update the code examples in the documentation to reflect the latest API changes in v6.",
        projectName: "React Router",
        projectImageUrl: "https://reactrouter.com/favicon-light.png",
        difficulty: "beginner",
        estimatedHours: "2-3 hours",
        tags: ["react", "documentation", "javascript"],
        link: "https://github.com/remix-run/react-router/issues/9350"
      },
      {
        title: "Add unit tests for tf.data transformation functions",
        description: "Write unit tests for the recently added data transformation functions to ensure they work as expected.",
        projectName: "TensorFlow",
        projectImageUrl: "https://www.tensorflow.org/site-assets/images/project-logos/tensorflow-logo-social.png",
        difficulty: "intermediate",
        estimatedHours: "4-6 hours",
        tags: ["python", "tensorflow", "testing"],
        link: "https://github.com/tensorflow/tensorflow/issues/54321"
      },
      {
        title: "Optimize WebGL rendering performance for complex animations",
        description: "Identify and fix performance bottlenecks in the WebGL rendering pipeline for complex animations.",
        projectName: "Mozilla Firefox",
        projectImageUrl: "https://www.mozilla.org/media/img/favicons/mozilla/favicon.d25d81d39065.ico",
        difficulty: "advanced",
        estimatedHours: "10-15 hours",
        tags: ["webgl", "javascript", "performance", "animations"],
        link: "https://github.com/mozilla/gecko-dev/issues/7890"
      },
      {
        title: "Improve accessibility for dropdown menu component",
        description: "Enhance the dropdown menu component to better support screen readers and keyboard navigation.",
        projectName: "Material UI",
        projectImageUrl: "https://mui.com/static/favicon.ico",
        difficulty: "intermediate",
        estimatedHours: "3-5 hours",
        tags: ["react", "accessibility", "ui", "javascript"],
        link: "https://github.com/mui/material-ui/issues/12345"
      },
      {
        title: "Fix CSS styling issues in dark mode",
        description: "Some components don't render correctly in dark mode. Find and fix the CSS issues.",
        projectName: "VS Code",
        projectImageUrl: "https://code.visualstudio.com/favicon.ico",
        difficulty: "beginner",
        estimatedHours: "2-4 hours",
        tags: ["css", "dark-mode", "ui"],
        link: "https://github.com/microsoft/vscode/issues/54321"
      },
      {
        title: "Implement lazy loading for large JSON datasets",
        description: "Add lazy loading capability to improve performance when loading large JSON datasets in the visualization component.",
        projectName: "D3.js",
        projectImageUrl: "https://d3js.org/favicon.png",
        difficulty: "advanced",
        estimatedHours: "8-12 hours",
        tags: ["javascript", "performance", "data-visualization"],
        link: "https://github.com/d3/d3/issues/9876"
      }
    ];

    // Add sample tasks
    sampleTasks.forEach(task => {
      const id = this.taskIdCounter++;
      const newTask: Task = { ...task, id };
      this.tasks.set(id, newTask);
    });

    // Sample resources
    const sampleResources: InsertResource[] = [
      {
        title: "Git and GitHub Basics",
        description: "Learn the fundamentals of version control with Git and collaborating on GitHub.",
        imageUrl: "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png",
        link: "/learning-center/git-basics",
        category: "version-control"
      },
      {
        title: "How to Write Good Pull Requests",
        description: "Learn best practices for creating pull requests that get accepted by project maintainers.",
        imageUrl: "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png",
        link: "/learning-center/pull-requests",
        category: "collaboration"
      },
      {
        title: "Effective Code Reviews",
        description: "Learn how to give and receive helpful code reviews to improve code quality.",
        imageUrl: "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png",
        link: "/learning-center/code-reviews",
        category: "collaboration"
      },
      {
        title: "Open Source Licensing Guide",
        description: "Understand different open source licenses and how to choose the right one for your project.",
        imageUrl: "https://opensource.org/files/osi_keyhole_300X300_90ppi_0.png",
        link: "/learning-center/licensing",
        category: "legal"
      },
      {
        title: "Contributing to Documentation",
        description: "A beginner's guide to making meaningful contributions to project documentation.",
        imageUrl: "https://docusaurus.io/img/docusaurus.png",
        link: "/learning-center/documentation",
        category: "documentation"
      }
    ];

    // Add sample resources
    sampleResources.forEach(resource => {
      const id = this.resourceIdCounter++;
      const newResource: Resource = { ...resource, id };
      this.resources.set(id, newResource);
    });

    // Create sample user
    const sampleUser: InsertUser = {
      username: "janesmith",
      password: "password123", // This would be hashed in a real application
      displayName: "Jane Smith",
      role: "Computer Science Student",
      avatarInitials: "JS"
    };
    
    const userId = this.userIdCounter++;
    const user: User = { 
      ...sampleUser, 
      id: userId, 
      level: "intermediate", 
      levelProgress: 65 
    };
    this.users.set(userId, user);

    // Create sample saved tasks for the user
    const savedTaskIds = [1, 2, 4, 5, 6, 3, 4];
    savedTaskIds.forEach(taskId => {
      if (this.tasks.has(taskId)) {
        const id = this.savedTaskIdCounter++;
        const savedTask: SavedTask = {
          id,
          userId,
          taskId,
          savedAt: new Date()
        };
        this.savedTasks.set(id, savedTask);
      }
    });

    // Create sample contributions for the user
    const completedTaskIds = [2, 5, 4];
    completedTaskIds.forEach(taskId => {
      if (this.tasks.has(taskId)) {
        const id = this.contributionIdCounter++;
        const contribution: Contribution = {
          id,
          userId,
          taskId,
          completedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date in the last 30 days
          pullRequestUrl: `https://github.com/example/project/pull/${Math.floor(Math.random() * 1000)}`,
          description: `Fixed issue #${Math.floor(Math.random() * 1000)} by implementing the requested feature.`
        };
        this.contributions.set(id, contribution);
      }
    });

    // Create sample resume for the user
    const sampleResume: InsertResume = {
      userId,
      personalInfo: {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        phone: "123-456-7890",
        location: "San Francisco, CA",
        linkedin: "linkedin.com/in/janesmith",
        github: "github.com/janesmith",
        website: "janesmith.dev"
      },
      skills: ["JavaScript", "React", "Node.js", "Python", "CSS", "HTML", "Git"],
      education: [
        {
          institution: "University of California, Berkeley",
          degree: "B.S. Computer Science",
          startDate: "2018-09",
          endDate: "2022-05",
          description: "GPA: 3.8/4.0"
        }
      ],
      experience: [],
      projects: [],
      certifications: [],
      completionPercentage: 75
    };
    
    const resumeId = this.resumeIdCounter++;
    const resume: Resume = { ...sampleResume, id: resumeId };
    this.resumes.set(resumeId, resume);
  }
}

export const storage = new MemStorage();
