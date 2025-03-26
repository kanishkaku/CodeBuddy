import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type ResumeSection = {
  name: string;
  description: string;
  isComplete: boolean;
};

export default function ResumeSection() {
  const { data: user } = useQuery({
    queryKey: ["/api/current-user"],
  });

  const { data: resume, isLoading } = useQuery({
    queryKey: [`/api/users/${user?.id}/resume`],
    enabled: !!user,
  });

  const resumeSections: ResumeSection[] = [
    {
      name: "Personal Information",
      description: "Basic details like name, contact, and education",
      isComplete: !!resume?.personalInfo,
    },
    {
      name: "Skills",
      description: "Technical skills, programming languages, and tools",
      isComplete: !!resume?.skills && resume.skills.length > 0,
    },
    {
      name: "Open Source Contributions",
      description: "Completed tasks and project contributions",
      isComplete: true, // Assuming we always track contributions
    },
    {
      name: "Projects",
      description: "Personal or academic projects showcase",
      isComplete: !!resume?.projects && resume.projects.length > 0,
    },
    {
      name: "Certifications",
      description: "Professional certifications and courses",
      isComplete: !!resume?.certifications && resume.certifications.length > 0,
    },
  ];

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Your Resume</h2>
          <Skeleton className="h-9 w-24" />
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-24" />
            </div>
            
            <Skeleton className="h-2.5 w-full mb-6" />
            
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-start">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <div className="ml-3">
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const completionPercentage = resume?.completionPercentage || 
    Math.round((resumeSections.filter(s => s.isComplete).length / resumeSections.length) * 100);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">Your Resume</h2>
        <Button asChild>
          <Link href="/my-resume">Edit Resume</Link>
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-medium text-gray-900">Resume Completeness</h3>
            <span className="text-sm font-medium text-gray-500">{completionPercentage}% Complete</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
            <div 
              className="bg-primary h-2.5 rounded-full" 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          
          <div className="space-y-4">
            {resumeSections.map((section, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0">
                  {section.isComplete ? (
                    <Check className="h-5 w-5 text-success" />
                  ) : (
                    <div className="h-5 w-5 text-gray-300 border rounded-full flex items-center justify-center">
                      <div className="h-2 w-2 bg-gray-300 rounded-full"></div>
                    </div>
                  )}
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-900">{section.name}</h4>
                  <p className="text-xs text-gray-500">{section.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
