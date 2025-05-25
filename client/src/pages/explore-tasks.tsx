import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { Search, Github, AlertTriangle, Hourglass, Code } from "lucide-react";
import TaskCard from "../components/tasks/task-card";
import { Skeleton } from "../components/ui/skeleton";
import { Button } from "../components/ui/button";
import { Task } from "../../../shared/schema";
import { useToast } from "../hooks/use-toast";

export default function ExploreTasks() {
  const [difficulty, setDifficulty] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [dataSource] = useState<"goodfirstissue">("goodfirstissue");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const { toast } = useToast();

  // Featured GitHub search terms for suggestions
  const githubSuggestions = [
    "good first issue",
    "documentation",
    "bug fix",
    "enhancement",
    "help wanted",
    "feature request",
    "ui",
    "beginner friendly"
  ];
  
  // Featured label suggestions for Good First Issues
  const goodFirstIssueLabelSuggestions = [
    "documentation",
    "enhancement",
    "bug",
    "feature",
    "help wanted",
    "ui",
    "test",
    "refactoring"
  ];

  // Fetch tasks based on dataSource (local, github, or goodfirstissue)
  const { data: tasks, isLoading, error, refetch } = useQuery({
    queryKey: ["/api/tasks", dataSource, difficulty, searchQuery],
    queryFn: async () => {
      setSearchError(null);
      setIsRateLimited(false);
      
      // If GitHub source, use the query parameters for github search
      if (dataSource === "github") {
        try {
          setIsSearching(true);
          const url = new URL("/api/tasks", window.location.origin);
          url.searchParams.append("source", "github");
          if (difficulty) url.searchParams.append("difficulty", difficulty);
          if (searchQuery) url.searchParams.append("q", searchQuery);
          
          const response = await fetch(url.toString());
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMsg = errorData.error || "Failed to fetch GitHub tasks";
            
            // Check if it's a rate limit error
            if (errorMsg.toLowerCase().includes("rate limit") || 
                errorMsg.toLowerCase().includes("exceeded") ||
                response.status === 403) {
              setIsRateLimited(true);
              throw new Error("GitHub API rate limit exceeded. Please wait a few minutes before trying again.");
            }
            
            throw new Error(errorMsg);
          }
          
          const data = await response.json();
          return data;
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "Failed to fetch GitHub tasks";
          
          if (errorMessage.toLowerCase().includes("rate limit")) {
            setIsRateLimited(true);
            toast({
              title: "GitHub API Rate Limit",
              description: "Rate limit exceeded. Results shown may be from cache. Try again in a few minutes.",
              variant: "destructive"
            });
          }
          
          setSearchError(errorMessage);
          throw err;
        } finally {
          setIsSearching(false);
        }
      } 
      // If Good First Issues source, use the goodfirstissue endpoint
      else if (dataSource === "goodfirstissue") {
        try {
          setIsSearching(true);
          const url = new URL("/api/tasks", window.location.origin);
          url.searchParams.append("source", "goodfirstissue");
          
          // Add language filter if difficulty is specified (maps to programming language)
          if (difficulty && difficulty !== "all") {
            url.searchParams.append("difficulty", difficulty); // Using difficulty param for language
          }
          
          // Add tags if searchQuery is specified
          if (searchQuery) {
            url.searchParams.append("tags", searchQuery); // Can be used to filter by tags/keywords
          }
          
          const response = await fetch(url.toString());
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || "Failed to fetch Good First Issues");
          }
          
          const data = await response.json();
          return data;
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "Failed to fetch Good First Issues";
          setSearchError(errorMessage);
          toast({
            title: "Error Loading Good First Issues",
            description: errorMessage,
            variant: "destructive"
          });
          throw err;
        } finally {
          setIsSearching(false);
        }
      }
      
      // Otherwise use default endpoint for local tasks
      try {
        const response = await fetch("/api/tasks");
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
        return await response.json();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch tasks";
        setSearchError(errorMessage);
        throw err;
      }
    },
    enabled: true,
    retry: 1, // Only retry once to avoid multiple API calls
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });

  useEffect(() => {
    if (!tasks) return;

    // If external API source, no client-side filtering needed
    if (dataSource === "github" || dataSource === "goodfirstissue") {
      setFilteredTasks(tasks);
      return;
    }

    // Local filtering for the in-memory tasks
    let filtered = [...tasks];

    // Filter by difficulty
    if (difficulty && difficulty !== "all") {
      filtered = filtered.filter(task => task.difficulty === difficulty);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        task =>
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query) ||
          task.projectName.toLowerCase().includes(query) ||
          (task.tags && task.tags.some((tag: string) => tag.toLowerCase().includes(query)))
      );
    }

    setFilteredTasks(filtered);
  }, [tasks, difficulty, searchQuery, dataSource]);

  // Reset difficulty when changing data source
  useEffect(() => {
    setDifficulty("all");
  }, [dataSource]);
  
  // Handle data source change
  const toggleDataSource = () => {
    const newSource = dataSource === "local" ? "github" : "local";
    setDataSource(newSource);
    setSearchError(null);
    refetch();
  };

  // Handle search submit
  const handleSearch = () => {
    refetch();
  };

  // Get unique tags from all tasks
  const allTags = tasks ? Array.from(new Set(tasks.flatMap(task => task.tags || []))) : [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Explore Open Source Tasks</h1>
        <p className="text-gray-500">
          Find tasks that match your skills and interests to build your resume with real-world contributions.
        </p>
      </div>

      <Card className="p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-2 flex-wrap gap-2">
            <Button 
              variant="default"
              className="flex items-center"
            >
              <span className="mr-1">Good First Issues</span>
            </Button>
          </div>
          <div className="text-sm text-gray-500 hidden md:block">
            Real tasks from goodfirstissue.dev
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder={
                dataSource === "github" 
                  ? "Search GitHub issues (e.g., 'react', 'bug fix', etc.)" 
                  : dataSource === "goodfirstissue"
                    ? "Filter by labels (e.g., 'documentation', 'enhancement', etc.)"
                    : "Search tasks..."
              }
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (dataSource === "github" || dataSource === "goodfirstissue")) {
                  handleSearch();
                }
              }}
            />
          </div>
          <div>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                {dataSource === "goodfirstissue" ? (
                  <>
                    <SelectItem value="all">All Languages</SelectItem>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="typescript">TypeScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="ruby">Ruby</SelectItem>
                    <SelectItem value="go">Go</SelectItem>
                    <SelectItem value="rust">Rust</SelectItem>
                    <SelectItem value="c#">C#</SelectItem>
                    <SelectItem value="c++">C++</SelectItem>
                    <SelectItem value="php">PHP</SelectItem>
                  </>
                ) : dataSource === "github" ? (
                  <>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="good-first-issue">Good First Issue</SelectItem>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="bug">Bug</SelectItem>
                    <SelectItem value="enhancement">Enhancement</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="all">All Difficulty</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {dataSource === "github" && (
          <div className="mt-4">
            <Button 
              onClick={handleSearch}
              disabled={isSearching}
              className="w-full"
            >
              {isSearching ? (
                <span className="flex items-center">
                  <Hourglass className="h-4 w-4 mr-2 animate-spin" />
                  Searching GitHub...
                </span>
              ) : isRateLimited ? (
                <span className="flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Rate Limited - Using Cache
                </span>
              ) : (
                "Search GitHub Issues"
              )}
            </Button>

            {isRateLimited && (
              <div className="mt-2 text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
                GitHub rate limit reached. Results shown may be cached or limited. Please wait a few minutes before trying again.
              </div>
            )}
            
            <p className="mt-2 text-xs text-gray-500">
              Press Enter or click the button to search. Results are fetched from popular open source repositories.
            </p>
            
            {/* GitHub search suggestions */}
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Popular search terms:</p>
              <div className="flex flex-wrap gap-2">
                {githubSuggestions.map((suggestion, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => {
                      setSearchQuery(suggestion);
                      // Automatically search when a suggestion is clicked
                      setTimeout(() => handleSearch(), 100);
                    }}
                  >
                    {suggestion}
                  </Badge>
                ))}
              </div>
            </div>
            
            {searchError && !isRateLimited && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{searchError}</p>
              </div>
            )}
          </div>
        )}

        {dataSource === "goodfirstissue" && (
          <div className="mt-4">
            <Button 
              onClick={handleSearch}
              disabled={isSearching}
              className="w-full"
            >
              {isSearching ? (
                <span className="flex items-center">
                  <Hourglass className="h-4 w-4 mr-2 animate-spin" />
                  Finding Issues...
                </span>
              ) : (
                "Find Good First Issues"
              )}
            </Button>
            
            <p className="mt-2 text-xs text-gray-500">
              Select a programming language and optionally filter by labels. Results from goodfirstissue.dev.
            </p>
            
            {/* Good First Issue label suggestions */}
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Popular labels:</p>
              <div className="flex flex-wrap gap-2">
                {goodFirstIssueLabelSuggestions.map((suggestion, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => {
                      setSearchQuery(suggestion);
                      // Automatically search when a suggestion is clicked
                      setTimeout(() => handleSearch(), 100);
                    }}
                  >
                    {suggestion}
                  </Badge>
                ))}
              </div>
            </div>
            
            {searchError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{searchError}</p>
              </div>
            )}
          </div>
        )}

        
      </Card>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="border rounded-lg overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center">
                  <Skeleton className="h-5 w-5 rounded mr-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-5 w-16" />
              </div>
              <div className="p-4">
                <Skeleton className="h-5 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-3/4" />
                <div className="mt-4">
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="mt-4 flex space-x-2">
                  <Skeleton className="h-9 w-24" />
                  <Skeleton className="h-9 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredTasks.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : searchError && (dataSource === "github" || dataSource === "goodfirstissue") ? (
        <div className="text-center py-12 border rounded-lg bg-white">
          <div className="flex flex-col items-center">
            <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {dataSource === "github" ? "Error Loading GitHub Tasks" : "Error Loading Good First Issues"}
            </h3>
            <p className="text-gray-500 max-w-md mb-4">{searchError}</p>
            <Button 
              variant="outline" 
              onClick={() => setDataSource("local")}
              className="mt-2"
            >
              Switch to Sample Tasks
            </Button>
          </div>
        </div>
      ) : dataSource === "github" && !searchQuery && !isRateLimited ? (
        <div className="text-center py-12 border rounded-lg bg-white">
          <div className="flex flex-col items-center">
            <Github className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Search for GitHub Tasks</h3>
            <p className="text-gray-500 max-w-md">
              Enter a search term or select a popular search suggestion above to find real open source issues on GitHub
            </p>
          </div>
        </div>
      ) : dataSource === "goodfirstissue" && !searchQuery ? (
        <div className="text-center py-12 border rounded-lg bg-white">
          <div className="flex flex-col items-center">
            <Code className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Find Good First Issues</h3>
            <p className="text-gray-500 max-w-md">
              Select a programming language and optionally filter by labels to find beginner-friendly issues on open source projects
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-white">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No matching tasks found</h3>
          <p className="text-gray-500">Try adjusting your filters or search query</p>
        </div>
      )}
    </div>
  );
}
