import { Octokit } from "octokit";
import { Task } from "@shared/schema";

// Initialize Octokit with the provided GitHub token
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
  request: {
    retries: 3,
    retryAfter: 5
  }
});

// Default repositories to search for issues in (prioritized order)
const DEFAULT_REPOS = [
  // Prioritize these popular repos with many good first issues
  { owner: "facebook", repo: "react", language: "JavaScript" },
  { owner: "vuejs", repo: "vue", language: "JavaScript" },
  { owner: "microsoft", repo: "vscode", language: "TypeScript" },
  // Secondary repositories
  { owner: "angular", repo: "angular", language: "TypeScript" },
  { owner: "nodejs", repo: "node", language: "JavaScript" },
  { owner: "expressjs", repo: "express", language: "JavaScript" },
  { owner: "sveltejs", repo: "svelte", language: "JavaScript" },
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
  limit: number = 25
): Promise<Task[]> {
  try {
    let issues: GitHubIssue[] = [];
    let tasks: Task[] = [];
    let labelQuery = '';

    console.log(`[GitHub Service] Searching for issues with difficulty: ${difficulty}, query: ${searchQuery}`);

    // Prepare label query based on difficulty
    if (difficulty === 'beginner' || difficulty === 'good-first-issue') {
      labelQuery = BEGINNER_LABELS.map(label => `label:"${label}"`).join(" OR ");
    } else if (difficulty === 'intermediate' || difficulty === 'enhancement') {
      labelQuery = 'label:"enhancement" OR label:"feature"';
    } else if (difficulty === 'advanced' || difficulty === 'bug') {
      labelQuery = 'label:"bug" OR label:"performance" OR label:"security"';
    } else if (difficulty === 'easy') {
      labelQuery = 'label:"easy" OR label:"beginner-friendly"';
    }

    // Limit to top repositories to avoid rate limits
    // Only query up to 3 repositories at a time
    const reposToQuery = DEFAULT_REPOS.slice(0, 3);
    
    // For specific searches, target just one repository
    if (searchQuery.length > 3) {
      // Search in parallel for a subset of repos (max 3)
      const searchPromises = reposToQuery.map(async (repo) => {
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
            per_page: Math.min(10, limit), // Reduce per-repo limit
            sort: "created",
            order: "desc"
          });

          if (response.data.items && response.data.items.length > 0) {
            return response.data.items;
          }
          return [];
        } catch (error) {
          console.error(`Error fetching issues from ${repo.owner}/${repo.repo}:`, error);
          // Just return empty array on error, we'll continue with other repos
          return [];
        }
      });
      
      // Wait for all search queries to complete
      const results = await Promise.allSettled(searchPromises);
      
      // Combine all successful results
      results.forEach(result => {
        if (result.status === 'fulfilled') {
          issues = [...issues, ...result.value];
        }
      });
    } else {
      // If no specific search term, just search one popular repo
      // This gives fast results for initial page load
      const repo = DEFAULT_REPOS[0]; // Start with first repo (React)
      try {
        const queryParams = [`repo:${repo.owner}/${repo.repo}`, "is:issue", "is:open", "no:assignee"];
        
        if (labelQuery) {
          queryParams.push(`(${labelQuery})`);
        }

        const queryString = queryParams.join(" ");
        console.log(`[GitHub Service] Searching with quick query: ${queryString}`);

        const response = await octokit.rest.search.issuesAndPullRequests({
          q: queryString,
          per_page: Math.min(15, limit),
          sort: "created",
          order: "desc"
        });

        if (response.data.items && response.data.items.length > 0) {
          issues = [...issues, ...response.data.items];
        }
      } catch (error) {
        console.error(`Error fetching issues from ${repo.owner}/${repo.repo}:`, error);
      }
    }

    // Convert GitHub issues to Task format
    tasks = await Promise.all(
      issues.slice(0, limit).map(async (issue) => {
        try {
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
            // Special case for GitHub-specific filters
            if (difficulty === 'good-first-issue') {
              taskDifficulty = "beginner";
            } else if (difficulty !== 'all') {
              taskDifficulty = difficulty;
            }
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
        } catch (error) {
          console.error("Error processing GitHub issue:", error);
          return null;
        }
      })
    );

    // Filter out null results from any errors
    tasks = tasks.filter(task => task !== null) as Task[];
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