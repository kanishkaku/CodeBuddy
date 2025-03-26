import { Octokit } from "octokit";
import { Task } from "@shared/schema";

// Initialize Octokit with the provided GitHub token
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

// Default repositories to search for issues in
const DEFAULT_REPOS = [
  { owner: "facebook", repo: "react", language: "JavaScript" },
  { owner: "vuejs", repo: "vue", language: "JavaScript" },
  { owner: "angular", repo: "angular", language: "TypeScript" },
  { owner: "sveltejs", repo: "svelte", language: "JavaScript" },
  { owner: "nodejs", repo: "node", language: "JavaScript" },
  { owner: "expressjs", repo: "express", language: "JavaScript" },
  { owner: "python", repo: "cpython", language: "Python" },
  { owner: "django", repo: "django", language: "Python" },
  { owner: "spring-projects", repo: "spring-boot", language: "Java" },
  { owner: "microsoft", repo: "TypeScript", language: "TypeScript" },
  { owner: "rust-lang", repo: "rust", language: "Rust" },
  { owner: "golang", repo: "go", language: "Go" },
];

// Labels to search for beginner-friendly issues
const BEGINNER_LABELS = [
  "good first issue",
  "beginner",
  "easy",
  "starter",
  "good-first-issue",
  "first-timers-only",
  "help wanted",
  "up-for-grabs",
  "beginner friendly"
];

interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  html_url: string;
  body: string;
  labels: Array<{ name: string }>;
  created_at: string;
  updated_at: string;
  repository_url: string;
  user: {
    login: string;
    avatar_url: string;
  };
}

interface RepoInfo {
  owner: string;
  repo: string;
  language: string;
}

export async function searchGitHubIssues(
  difficulty: string = '',
  searchQuery: string = '',
  limit: number = 50
): Promise<Task[]> {
  try {
    let issues: GitHubIssue[] = [];
    let tasks: Task[] = [];
    let labelQuery = '';

    console.log(`[GitHub Service] Searching for issues with difficulty: ${difficulty}, query: ${searchQuery}`);

    // Prepare label query based on difficulty
    if (difficulty === 'beginner') {
      labelQuery = BEGINNER_LABELS.map(label => `label:"${label}"`).join(" OR ");
    } else if (difficulty === 'intermediate') {
      labelQuery = 'label:"enhancement" OR label:"feature"';
    } else if (difficulty === 'advanced') {
      labelQuery = 'label:"bug" OR label:"performance" OR label:"security"';
    }

    // Search for issues using GitHub API
    for (const repo of DEFAULT_REPOS) {
      try {
        const queryParams = [`repo:${repo.owner}/${repo.repo}`, "is:issue", "is:open", "no:assignee"];
        
        if (labelQuery) {
          queryParams.push(`(${labelQuery})`);
        }
        
        if (searchQuery) {
          queryParams.push(`${searchQuery} in:title,body`);
        }

        const queryString = queryParams.join(" ");
        console.log(`[GitHub Service] Searching with query: ${queryString}`);

        const response = await octokit.rest.search.issuesAndPullRequests({
          q: queryString,
          per_page: Math.min(25, limit),
          sort: "created",
          order: "desc"
        });

        if (response.data.items && response.data.items.length > 0) {
          issues = [...issues, ...response.data.items];
        }
        
        // Avoid rate limiting
        if (issues.length >= limit) break;
        
      } catch (error) {
        console.error(`Error fetching issues from ${repo.owner}/${repo.repo}:`, error);
      }
    }

    // Convert GitHub issues to Task format
    tasks = await Promise.all(
      issues.slice(0, limit).map(async (issue) => {
        // Extract repository name from repository_url
        const repoUrlParts = issue.repository_url.split('/');
        const repoOwner = repoUrlParts[repoUrlParts.length - 2];
        const repoName = repoUrlParts[repoUrlParts.length - 1];
        
        // Find repository language
        const repoInfo = DEFAULT_REPOS.find(r => r.owner === repoOwner && r.repo === repoName) || 
                         { language: "Unknown" };

        // Determine difficulty based on labels
        let taskDifficulty = "intermediate";
        const issueLabels = issue.labels.map(label => label.name.toLowerCase());
        
        if (issueLabels.some(label => 
          BEGINNER_LABELS.some(beginnerLabel => 
            label.includes(beginnerLabel.toLowerCase())
          )
        )) {
          taskDifficulty = "beginner";
        } else if (issueLabels.some(label => 
          ["bug", "performance", "security", "complex", "advanced", "hard"].includes(label)
        )) {
          taskDifficulty = "advanced";
        }

        // If specific difficulty was requested, use that
        if (difficulty) {
          taskDifficulty = difficulty;
        }

        // Clean up description - limited to first 300 chars
        let description = issue.body || "";
        description = description.replace(/\r\n|\n|\r/g, " ").trim();
        if (description.length > 300) {
          description = description.substring(0, 297) + "...";
        }

        // Estimate hours based on difficulty
        const estimatedHours = taskDifficulty === "beginner" 
          ? "1-2 hours" 
          : taskDifficulty === "intermediate" 
            ? "2-5 hours" 
            : "5+ hours";

        // Create tags from labels
        const tags = issue.labels
          .map(label => label.name)
          .filter(label => label.length < 20) // Filter out very long labels
          .slice(0, 5);  // Limit to 5 tags
        
        // Add difficulty and language as tags if not already present
        if (!tags.includes(taskDifficulty)) {
          tags.push(taskDifficulty);
        }
        if (!tags.includes(repoInfo.language)) {
          tags.push(repoInfo.language);
        }

        // Generate a synthetic unique ID from GitHub data
        const id = issue.id % 10000; // Use modulo to keep ID within reasonable range

        return {
          id,
          title: issue.title,
          description,
          difficulty: taskDifficulty,
          estimatedHours,
          projectName: `${repoOwner}/${repoName}`,
          projectImageUrl: `https://github.com/${repoOwner}.png`,
          tags,
          link: issue.html_url,
          createdAt: new Date(issue.created_at).toISOString()
        };
      })
    );

    console.log(`[GitHub Service] Found ${tasks.length} tasks`);
    return tasks;
  } catch (error) {
    console.error("Error in searchGitHubIssues:", error);
    throw new Error("Failed to fetch GitHub issues");
  }
}

export async function fetchGitHubIssueDetails(owner: string, repo: string, issueNumber: number): Promise<Task | null> {
  try {
    const response = await octokit.rest.issues.get({
      owner,
      repo,
      issue_number: issueNumber
    });

    const issue = response.data;
    
    // Determine difficulty based on labels
    let taskDifficulty = "intermediate";
    const issueLabels = issue.labels.map((label: any) => 
      typeof label === 'string' ? label.toLowerCase() : label.name.toLowerCase()
    );
    
    if (issueLabels.some((label: string) => 
      BEGINNER_LABELS.some(beginnerLabel => 
        label.includes(beginnerLabel.toLowerCase())
      )
    )) {
      taskDifficulty = "beginner";
    } else if (issueLabels.some((label: string) => 
      ["bug", "performance", "security", "complex", "advanced", "hard"].includes(label)
    )) {
      taskDifficulty = "advanced";
    }

    // Find repository language
    const repoInfo = DEFAULT_REPOS.find(r => r.owner === owner && r.repo === repo) || 
                     { language: "Unknown" };

    // Clean up description - limited to first 300 chars
    let description = issue.body || "";
    description = description.replace(/\r\n|\n|\r/g, " ").trim();
    if (description.length > 300) {
      description = description.substring(0, 297) + "...";
    }

    // Estimate hours based on difficulty
    const estimatedHours = taskDifficulty === "beginner" 
      ? "1-2 hours" 
      : taskDifficulty === "intermediate" 
        ? "2-5 hours" 
        : "5+ hours";

    // Create tags from labels
    const tags = issue.labels
      .map((label: any) => typeof label === 'string' ? label : label.name)
      .filter((label: string) => label.length < 20) // Filter out very long labels
      .slice(0, 5);  // Limit to 5 tags
    
    // Add difficulty and language as tags if not already present
    if (!tags.includes(taskDifficulty)) {
      tags.push(taskDifficulty);
    }
    if (!tags.includes(repoInfo.language)) {
      tags.push(repoInfo.language);
    }

    // Generate a synthetic unique ID from GitHub data
    const id = issue.id % 10000; // Use modulo to keep ID within reasonable range

    return {
      id,
      title: issue.title,
      description,
      difficulty: taskDifficulty,
      estimatedHours,
      projectName: `${owner}/${repo}`,
      projectImageUrl: `https://github.com/${owner}.png`,
      tags,
      link: issue.html_url,
      createdAt: new Date(issue.created_at).toISOString()
    };
  } catch (error) {
    console.error(`Error fetching issue details from ${owner}/${repo}:`, error);
    return null;
  }
}