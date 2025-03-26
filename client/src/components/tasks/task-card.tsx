import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Github, ExternalLink } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Task } from "@shared/schema";

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);

  const { data: user } = useQuery({
    queryKey: ["/api/current-user"],
  });

  const { data: isSaved, isLoading: isCheckingSaved } = useQuery({
    queryKey: [`/api/users/${user?.id}/saved-tasks/${task.id}`],
    enabled: !!user,
  });

  const saveTaskMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("You must be logged in to save tasks");
      setSaving(true);
      await apiRequest("POST", "/api/saved-tasks", {
        userId: user.id,
        taskId: task.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}/saved-tasks`] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}/saved-tasks/${task.id}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}/stats`] });
      toast({
        title: "Task saved",
        description: "The task has been added to your saved tasks.",
      });
      setSaving(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save task",
        variant: "destructive",
      });
      setSaving(false);
    },
  });

  const removeTaskMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("You must be logged in to remove saved tasks");
      setSaving(true);
      await apiRequest("DELETE", `/api/users/${user.id}/saved-tasks/${task.id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}/saved-tasks`] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}/saved-tasks/${task.id}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}/stats`] });
      toast({
        title: "Task removed",
        description: "The task has been removed from your saved tasks.",
      });
      setSaving(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to remove task",
        variant: "destructive",
      });
      setSaving(false);
    },
  });

  const startTask = () => {
    window.open(task.link, "_blank");
  };

  const handleSaveToggle = () => {
    if (isSaved?.isSaved) {
      removeTaskMutation.mutate();
    } else {
      saveTaskMutation.mutate();
    }
  };

  const getDifficultyClass = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-orange-100 text-orange-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <img 
            src={task.projectImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(task.projectName)}&background=random`} 
            alt={`${task.projectName} logo`}
            className="h-5 w-5 rounded mr-2"
            onError={(e) => {
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(task.projectName)}&background=random`;
            }}
          />
          <span className="text-sm font-medium text-gray-700">{task.projectName}</span>
        </div>
        <span className={`px-2 py-1 text-xs rounded-full capitalize ${getDifficultyClass(task.difficulty)}`}>
          {task.difficulty}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900">{task.title}</h3>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{task.description}</p>
        
        {task.tags && task.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {task.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            <span>Est. {task.estimatedHours}</span>
          </div>
          
          {task.createdAt && (
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              <span>
                {new Date(task.createdAt).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
        
        <div className="mt-4 flex space-x-2">
          <Button 
            onClick={startTask} 
            className="flex items-center"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            <span>Start Task</span>
          </Button>
          <Button
            variant="outline"
            onClick={handleSaveToggle}
            disabled={saving || isCheckingSaved}
          >
            {isSaved?.isSaved ? "Unsave" : "Save"}
          </Button>
        </div>
        
        {task.projectName.includes('/') && (
          <div className="mt-2 text-xs text-gray-500 flex items-center">
            <Github className="h-3 w-3 mr-1" />
            <span>From GitHub</span>
          </div>
        )}
      </div>
    </Card>
  );
}
