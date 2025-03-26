import { useQuery } from "@tanstack/react-query";
import { 
  FileText, 
  Activity, 
  Bookmark
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function StatsSection() {
  const { data: user } = useQuery({
    queryKey: ["/api/current-user"],
  });

  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/users/1/stats"],
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 mb-8 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="ml-5 space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 mb-8 md:grid-cols-3">
      <Card className="p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-primary">
            <FileText className="h-6 w-6" />
          </div>
          <div className="ml-5">
            <p className="text-sm font-medium text-gray-500">Tasks Completed</p>
            <p className="mt-1 text-3xl font-semibold text-gray-900">
              {stats?.tasksCompleted || 0}
            </p>
          </div>
        </div>
      </Card>
      
      <Card className="p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-accent">
            <Activity className="h-6 w-6" />
          </div>
          <div className="ml-5">
            <p className="text-sm font-medium text-gray-500">Level Progress</p>
            <div className="mt-1 relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block text-accent capitalize">
                    {stats?.level || 'beginner'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-accent">
                    {stats?.levelProgress || 0}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 text-xs flex rounded bg-green-200">
                <div 
                  style={{ width: `${stats?.levelProgress || 0}%` }} 
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-accent"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      <Card className="p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-purple-100 text-secondary">
            <Bookmark className="h-6 w-6" />
          </div>
          <div className="ml-5">
            <p className="text-sm font-medium text-gray-500">Saved Tasks</p>
            <p className="mt-1 text-3xl font-semibold text-gray-900">
              {stats?.savedTasks || 0}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
