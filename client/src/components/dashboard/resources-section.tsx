import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import ResourceCard from "@/components/resources/resource-card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ResourcesSection() {
  const { data: resources, isLoading } = useQuery({
    queryKey: ["/api/resources"],
  });

  const featuredResources = resources?.slice(0, 3);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">Learning Resources</h2>
        <Link href="/learning-center">
          <a className="text-sm font-medium text-primary hover:text-primary-700">Browse Library</a>
        </Link>
      </div>
      
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
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
      ) : featuredResources?.length ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featuredResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-white">
          <p className="text-gray-500">No resources available at the moment.</p>
        </div>
      )}
    </div>
  );
}
