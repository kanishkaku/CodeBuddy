import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import ResourceCard from "@/components/resources/resource-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

export default function LearningCenter() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: resources, isLoading } = useQuery({
    queryKey: ["/api/resources"],
  });

  const filteredResources = resources?.filter(resource => 
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get unique categories for filtering
  const categories = resources 
    ? Array.from(new Set(resources.map(resource => resource.category)))
    : [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Learning Center</h1>
        <p className="text-gray-500">
          Resources to help you learn how to contribute to open source projects effectively.
        </p>
      </div>

      <Card className="p-6 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search resources..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {categories.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            <button 
              className={`px-3 py-1 text-sm rounded-full ${searchQuery === "" ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              onClick={() => setSearchQuery("")}
            >
              All
            </button>
            {categories.map((category, index) => (
              <button
                key={index}
                className={`px-3 py-1 text-sm rounded-full capitalize ${searchQuery.toLowerCase() === category ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                onClick={() => setSearchQuery(category)}
              >
                {category.replace(/-/g, ' ')}
              </button>
            ))}
          </div>
        )}
      </Card>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="border rounded-lg overflow-hidden">
              <Skeleton className="h-40 w-full" />
              <div className="p-4">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3" />
                <div className="mt-4">
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredResources && filteredResources.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 flex flex-col items-center text-center p-12">
            <div className="rounded-full bg-blue-100 p-3 mb-4">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
            <p className="text-gray-500 max-w-md">
              Try adjusting your search or check back later for new resources.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
