import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Bookmark, AlertCircle } from "lucide-react";
import TaskCard from "@/components/tasks/task-card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SavedTasks() {
  const { data: user } = useQuery({
    queryKey: ["/api/current-user"],
  });

  const { data: savedTasks, isLoading } = useQuery({
    queryKey: [`/api/users/${user?.id}/saved-tasks`],
    enabled: !!user,
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Saved Tasks</h1>
        <p className="text-gray-500">
          Tasks you've bookmarked to work on later.
        </p>
      </div>

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
      ) : savedTasks && savedTasks.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {savedTasks.map((savedTask: any) => (
            <TaskCard key={savedTask.id} task={savedTask.task} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 flex flex-col items-center text-center p-12">
            <div className="rounded-full bg-blue-100 p-3 mb-4">
              <Bookmark className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No saved tasks yet</h3>
            <p className="text-gray-500 max-w-md">
              Browse the explore section to find open source tasks that match your skills and save them for later.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
