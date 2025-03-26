import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import TaskCard from "@/components/tasks/task-card";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecommendedTasks() {
  const { data: tasks, isLoading } = useQuery({
    queryKey: ["/api/tasks"],
  });

  const recommendedTasks = tasks?.slice(0, 3);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">Recommended Tasks</h2>
        <Link href="/explore-tasks">
          <a className="text-sm font-medium text-primary hover:text-primary-700">View All</a>
        </Link>
      </div>
      
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
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
      ) : recommendedTasks?.length ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recommendedTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-white">
          <p className="text-gray-500">No tasks available at the moment.</p>
        </div>
      )}
    </div>
  );
}
