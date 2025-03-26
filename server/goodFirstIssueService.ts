import { Task } from '@shared/schema';
import fetch from 'node-fetch';
import { log } from './vite';

// Cache implementation
interface CacheEntry {
  data: Task[];
  timestamp: number;
  key: string;
}

class APICache {
  private cache: Map<string, CacheEntry> = new Map();
  private readonly TTL: number = 15 * 60 * 1000; // 15 minutes cache TTL for Good First Issues API

  set(key: string, data: Task[]): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      key
    });
  }

  get(key: string): Task[] | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    // Check if the entry is expired
    if (Date.now() - entry.timestamp > this.TTL) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  clear(): void {
    this.cache.clear();
  }
}

const cache = new APICache();

// Interface for goodfirstissue.dev API response
interface GoodFirstIssue {
  id: string;
  title: string;
  html_url: string;
  created_at: string;
  updated_at: string;
  repository_url: string;
  state: string;
  labels: Array<{ name: string }>;
  body: string;
  repository: {
    name: string;
    full_name: string;
    description: string;
    language: string;
    html_url: string;
    owner: {
      login: string;
      avatar_url: string;
    }
  };
}

/**
 * Fetch "good first issues" from goodfirstissue.dev API
 * @param language - Optional filter by programming language
 * @param labels - Optional filter by issue labels
 * @returns An array of Task objects
 */
export async function fetchGoodFirstIssues(
  language?: string,
  labels?: string[]
): Promise<Task[]> {
  const cacheKey = `gfi-${language || 'all'}-${labels?.join(',') || 'all'}`;
  
  // Check if we have a valid cache entry
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    log(`[GoodFirstIssue Service] Returning cached issues for: ${cacheKey}`, 'express');
    return cachedData;
  }
  
  try {
    log(`[GoodFirstIssue Service] Fetching issues from GitHub API with 'good first issue' label`, 'express');
    
    // Build the API URL with optional filters
    // Note: If goodfirstissue.dev API is offline, we'll use GitHub API as a fallback
    
    // For the time being, let's simulate results with GitHub issues filtered by "good first issue" label
    const apiUrl = 'https://api.github.com/search/issues?q=label:"good+first+issue"+is:open';
    
    // Add language filter if provided
    const fullUrl = language 
      ? `${apiUrl}+language:${language}`
      : apiUrl;
      
    // GitHub API requires a User-Agent header and benefits from authentication
    // to increase rate limits
    const headers: Record<string, string> = {
      'User-Agent': 'OSResume-App'
    };
    
    // Add Authorization header if GITHUB_TOKEN is available
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
      log(`[GoodFirstIssue Service] Using GitHub token for authentication`, 'express');
    }
    
    const response = await fetch(fullUrl, { headers });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch good first issues: ${response.status} ${response.statusText}`);
    }
    
    // GitHub search API returns a different format, so we need to adapt
    const searchResult = await response.json() as any;
    const issues: any[] = searchResult.items || [];
    
    // We're using GitHub API which has a different structure
    let filteredIssues = issues;
    
    // Labels filtering will be done differently for GitHub API
    if (labels && labels.length > 0) {
      filteredIssues = filteredIssues.filter(issue => 
        issue.labels && issue.labels.some((label: any) => 
          labels.some(searchLabel => 
            label.name.toLowerCase().includes(searchLabel.toLowerCase())
          )
        )
      );
    }
    
    // Convert to our Task format
    const tasks: Task[] = filteredIssues.map((issue, index) => {
      // Extract repository info from the repository_url
      // Format: https://api.github.com/repos/owner/repo
      const repoUrlParts = (issue.repository_url || '').split('/');
      const repoOwner = repoUrlParts[repoUrlParts.length - 2] || 'unknown';
      const repoName = repoUrlParts[repoUrlParts.length - 1] || 'unknown';
      const fullRepoName = `${repoOwner}/${repoName}`;
      
      // Extract difficulty from labels - defaults to beginner for "good first issue"
      let difficulty = 'beginner';
      if (issue.labels && Array.isArray(issue.labels)) {
        if (issue.labels.some((label: any) => 
          label.name.toLowerCase().includes('intermediate')
        )) {
          difficulty = 'intermediate';
        } else if (issue.labels.some((label: any) => 
          label.name.toLowerCase().includes('advanced')
        )) {
          difficulty = 'advanced';
        }
      }
      
      // Extract tags from labels
      const tags = Array.isArray(issue.labels) 
        ? issue.labels.map((label: any) => label.name) 
        : ['good first issue'];
      
      // Truncate body if too long
      const description = issue.body || 'No description provided';
      const truncatedDescription = description.length > 300 
        ? `${description.substring(0, 300)}...` 
        : description;
      
      // Use avatar URL if available 
      const avatarUrl = issue.user && issue.user.avatar_url 
        ? issue.user.avatar_url 
        : `https://github.com/${repoOwner}.png`;
      
      return {
        id: issue.id || index + 1000, // Use issue ID or generate a unique ID
        title: issue.title,
        link: issue.html_url,
        description: truncatedDescription,
        projectName: fullRepoName,
        projectImageUrl: avatarUrl,
        estimatedHours: '2-4', // Default estimate
        difficulty,
        tags,
        createdAt: new Date(issue.created_at)
      };
    });
    
    // Cache the results
    cache.set(cacheKey, tasks);
    
    log(`[GoodFirstIssue Service] Found ${tasks.length} issues`, 'express');
    return tasks;
  } catch (error) {
    log(`[GoodFirstIssue Service] Error: ${error instanceof Error ? error.message : String(error)}`, 'express');
    throw error;
  }
}