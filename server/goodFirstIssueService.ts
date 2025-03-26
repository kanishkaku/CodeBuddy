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
    log(`[GoodFirstIssue Service] Fetching issues from goodfirstissue.dev API`, 'express');
    
    // Build the API URL with optional filters
    let apiUrl = 'https://goodfirstissue.dev/api/issues';
    
    // Parse the response
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch good first issues: ${response.status} ${response.statusText}`);
    }
    
    const issues: GoodFirstIssue[] = await response.json();
    
    // Apply client-side filtering if needed
    let filteredIssues = issues;
    
    if (language) {
      filteredIssues = filteredIssues.filter(issue => 
        issue.repository.language?.toLowerCase() === language.toLowerCase()
      );
    }
    
    if (labels && labels.length > 0) {
      filteredIssues = filteredIssues.filter(issue => 
        issue.labels.some(label => 
          labels.includes(label.name.toLowerCase())
        )
      );
    }
    
    // Convert to our Task format
    const tasks: Task[] = filteredIssues.map((issue, index) => {
      // Extract difficulty from labels
      let difficulty = 'beginner';
      if (issue.labels.some(label => label.name.toLowerCase().includes('intermediate'))) {
        difficulty = 'intermediate';
      } else if (issue.labels.some(label => label.name.toLowerCase().includes('advanced'))) {
        difficulty = 'advanced';
      }
      
      // Extract tags from labels
      const tags = issue.labels.map(label => label.name);
      
      // Truncate body if too long
      const description = issue.body || 'No description provided';
      const truncatedDescription = description.length > 300 
        ? `${description.substring(0, 300)}...` 
        : description;
      
      return {
        id: parseInt(issue.id) || index + 1000, // Use issue ID or generate a unique ID
        title: issue.title,
        link: issue.html_url,
        description: truncatedDescription,
        projectName: issue.repository.full_name,
        projectImageUrl: issue.repository.owner.avatar_url,
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