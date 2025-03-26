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
import { Search } from "lucide-react";
import TaskCard from "@/components/tasks/task-card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ExploreTasks() {
  const [difficulty, setDifficulty] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredTasks, setFilteredTasks] = useState<any[]>([]);

  const { data: tasks, isLoading } = useQuery({
    queryKey: ["/api/tasks"],
  });

  useEffect(() => {
    if (!tasks) return;

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
  }, [tasks, difficulty, searchQuery]);

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
        <div className="grid gap-4 md:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search tasks..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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

        {allTags.length > 0 && (
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
