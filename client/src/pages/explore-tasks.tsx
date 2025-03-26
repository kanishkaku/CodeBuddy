import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Github } from "lucide-react";
import TaskCard from "@/components/tasks/task-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Task } from "@shared/schema";

export default function ExploreTasks() {
  const [difficulty, setDifficulty] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [dataSource, setDataSource] = useState<"local" | "github">("local");
  const [isSearching, setIsSearching] = useState(false);

  // Fetch local tasks or GitHub tasks based on dataSource
  const { data: tasks, isLoading, refetch } = useQuery({
    queryKey: ["/api/tasks", dataSource, difficulty, searchQuery],
    queryFn: async () => {
      // If GitHub source, use the query parameters
      if (dataSource === "github") {
        setIsSearching(true);
        const url = new URL("/api/tasks", window.location.origin);
        url.searchParams.append("source", "github");
        if (difficulty) url.searchParams.append("difficulty", difficulty);
        if (searchQuery) url.searchParams.append("q", searchQuery);
        
        const response = await fetch(url.toString());
        if (!response.ok) {
          throw new Error("Failed to fetch GitHub tasks");
        }
        setIsSearching(false);
        return await response.json();
      }
      
      // Otherwise use default endpoint
      const response = await fetch("/api/tasks");
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      return await response.json();
    },
    enabled: true,
  });

  useEffect(() => {
    if (!tasks) return;

    // If GitHub source, no client-side filtering needed
    if (dataSource === "github") {
      setFilteredTasks(tasks);
      return;
    }

    // Local filtering for the in-memory tasks
    let filtered = [...tasks];

    // Filter by difficulty
    if (difficulty) {
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

  // Handle data source change
  const toggleDataSource = () => {
    const newSource = dataSource === "local" ? "github" : "local";
    setDataSource(newSource);
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
          <div className="flex space-x-2">
            <Button 
              variant={dataSource === "local" ? "default" : "outline"} 
              onClick={() => setDataSource("local")}
              className="flex items-center"
            >
              <span className="mr-1">Sample Tasks</span>
            </Button>
            <Button 
              variant={dataSource === "github" ? "default" : "outline"} 
              onClick={() => setDataSource("github")}
              className="flex items-center"
            >
              <Github className="h-4 w-4 mr-1" />
              <span>GitHub Tasks</span>
            </Button>
          </div>
          {dataSource === "github" && (
            <div className="text-sm text-gray-500">
              Searching real open source issues from GitHub
            </div>
          )}
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder={dataSource === "github" ? "Search GitHub issues (e.g., 'react', 'bug fix', etc.)" : "Search tasks..."}
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && dataSource === "github") {
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
                <SelectItem value="">All difficulties</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
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
              {isSearching ? "Searching GitHub..." : "Search GitHub Issues"}
            </Button>
            <p className="mt-2 text-xs text-gray-500">
              Press Enter or click the button to search. Results are fetched from popular open source repositories.
            </p>
          </div>
        )}

        {dataSource === "local" && allTags.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-2">Popular tags:</p>
            <div className="flex flex-wrap gap-2">
              {allTags.slice(0, 10).map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => setSearchQuery(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
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
      ) : (
        <div className="text-center py-12 border rounded-lg bg-white">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No matching tasks found</h3>
          <p className="text-gray-500">Try adjusting your filters or search query</p>
        </div>
      )}
    </div>
  );
}
