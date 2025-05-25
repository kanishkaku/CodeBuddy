import { Task } from "@shared/schema";
import fetch from "node-fetch";
import { log } from "./vite";

/**
 * Fetch "good first issues" from goodfirstissue.dev API
 * @param language - Optional filter by programming language
 * @param labels - Optional filter by issue labels
 * @returns An array of Task objects
 */
export async function fetchGoodFirstIssues(
  language?: string,
  labels?: string[],
): Promise<Task[]> {
  try {
    log(
      `[GoodFirstIssue Service] goodfirstissue.dev API is not available, using GitHub API instead`,
      "express",
    );

    // The goodfirstissue.dev now uses a different format with client-side rendering
    // and doesn't have a clean API endpoint for direct access
    // So we'll use GitHub API directly to get good first issues

    // Build the GitHub API URL for issues with "good first issue" label
    const apiUrl = "https://api.github.com/search/issues?q=is:issue+is:open+label:\"good+first+issue\"";

    // Add language filter if provided
    const fullUrl = language
      ? `${apiUrl}+language:${language}`
      : apiUrl;

    log(`[GoodFirstIssue Service] Using GitHub API directly: ${fullUrl}`, 'express');

    // GitHub API requires a User-Agent header and benefits from authentication
    // to increase rate limits
    const headers: Record<string, string> = {
      "User-Agent": "OSResume-App",
    };

    // Add Authorization header if GITHUB_TOKEN is available
    if (process.env.GITHUB_TOKEN) {
      headers["Authorization"] = `token ${process.env.GITHUB_TOKEN}`;
      log(
        `[GoodFirstIssue Service] Using GitHub token for authentication`,
        "express",
      );
    }

    const response = await fetch(fullUrl, { headers });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch good first issues: ${response.status} ${response.statusText}`,
      );
    }

    // GitHub search API returns a different format, so we need to adapt
    const searchResult = (await response.json()) as any;
    const issues: any[] = searchResult.items || [];

    // We're using GitHub API which has a different structure
    let filteredIssues = issues;

    // Labels filtering will be done differently for GitHub API
    if (labels && labels.length > 0) {
      filteredIssues = filteredIssues.filter(
        (issue) =>
          issue.labels &&
          issue.labels.some((label: any) =>
            labels.some((searchLabel) =>
              label.name.toLowerCase().includes(searchLabel.toLowerCase()),
            ),
          ),
      );
    }

    const tasks: Task[] = filteredIssues.map((issue, index) => {
      // Extract repository info from the repository_url
      // Format: https://api.github.com/repos/owner/repo
      const repoUrlParts = (issue.repository_url || "").split("/");
      const repoOwner = repoUrlParts[repoUrlParts.length - 2] || "unknown";
      const repoName = repoUrlParts[repoUrlParts.length - 1] || "unknown";
      const fullRepoName = `${repoOwner}/${repoName}`;

      // Extract difficulty from labels - defaults to beginner for "good first issue"
      let difficulty = "beginner";
      if (issue.labels && Array.isArray(issue.labels)) {
        if (
          issue.labels.some((label: any) =>
            label.name.toLowerCase().includes("intermediate"),
          )
        ) {
          difficulty = "intermediate";
        } else if (
          issue.labels.some((label: any) =>
            label.name.toLowerCase().includes("advanced"),
          )
        ) {
          difficulty = "advanced";
        }
      }

      // Extract tags from labels
      const tags = Array.isArray(issue.labels)
        ? issue.labels.map((label: any) => label.name)
        : ["good first issue"];

      // Truncate body if too long
      const description = issue.body || "No description provided";
      const truncatedDescription =
        description.length > 300
          ? `${description.substring(0, 300)}...`
          : description;

      // Use avatar URL if available
      const avatarUrl =
        issue.user && issue.user.avatar_url
          ? issue.user.avatar_url
          : `https://github.com/${repoOwner}.png`;

      return {
        id: issue.id || index + 1000, // Use issue ID or generate a unique ID
        title: issue.title,
        link: issue.html_url,
        description: truncatedDescription,
        projectName: fullRepoName,
        projectImageUrl: avatarUrl,
        estimatedHours: "2-4", // Default estimate
        difficulty,
        tags,
        createdAt: new Date(issue.created_at),
      };
    });

    log(`[GoodFirstIssue Service] Found ${tasks.length} issues`, "express");
    return tasks;
  } catch (error) {
    log(
      `[GoodFirstIssue Service] Error: ${error instanceof Error ? error.message : String(error)}`,
      "express",
    );
    throw error;
  }
}