import { Card } from "../../components/ui/card";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Resource } from "../../../../shared/schema";

interface ResourceCardProps {
  resource: Resource;
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <Card>
      <img 
        src={resource.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(resource.title)}&size=200&background=random`}
        alt={resource.title}
        className="h-40 w-full object-cover"
        onError={(e) => {
          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(resource.title)}&size=200&background=random`;
        }}
      />
      <div className="p-4">
        <h3 className="font-medium text-gray-900">{resource.title}</h3>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{resource.description}</p>
        <div className="mt-4">
          <Link href={resource.link}>
            <a className="inline-flex items-center text-sm font-medium text-primary">
              Start Learning
              <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </Link>
        </div>
      </div>
    </Card>
  );
}
