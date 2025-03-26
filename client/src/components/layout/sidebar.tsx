import { useLocation, Link } from "wouter";
import { Home, Search, FileText, Bookmark, BookOpen, HelpCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

const mainNavItems: NavItem[] = [
  {
    href: "/",
    label: "Dashboard",
    icon: <Home className="h-5 w-5 mr-3" />,
  },
  {
    href: "/explore-tasks",
    label: "Explore Tasks",
    icon: <Search className="h-5 w-5 mr-3" />,
  },
  {
    href: "/my-resume",
    label: "My Resume",
    icon: <FileText className="h-5 w-5 mr-3" />,
  },
  {
    href: "/saved-tasks",
    label: "Saved Tasks",
    icon: <Bookmark className="h-5 w-5 mr-3" />,
  },
];

const resourceNavItems: NavItem[] = [
  {
    href: "/learning-center",
    label: "Learning Center",
    icon: <BookOpen className="h-5 w-5 mr-3" />,
  },
  {
    href: "/help-center",
    label: "Help Center",
    icon: <HelpCircle className="h-5 w-5 mr-3" />,
  },
];

export default function Sidebar() {
  const [location] = useLocation();
  
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/current-user"],
  });

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
        <div className="flex items-center h-16 px-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800">
            <span className="text-primary">OS</span>Resume
          </h1>
        </div>
        <nav className="flex-1 pt-3 pb-4 overflow-y-auto">
          <div className="px-4 pb-2">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Main</h2>
          </div>
          
          {mainNavItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <a
                className={cn(
                  "flex items-center px-4 py-2.5 text-sm font-medium",
                  location === item.href
                    ? "text-primary bg-blue-50 border-l-2 border-primary"
                    : "text-gray-600 hover:text-primary hover:bg-gray-50"
                )}
              >
                {item.icon}
                {item.label}
              </a>
            </Link>
          ))}
          
          <div className="px-4 pt-5 pb-2">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Resources</h2>
          </div>
          
          {resourceNavItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <a
                className={cn(
                  "flex items-center px-4 py-2.5 text-sm font-medium",
                  location === item.href
                    ? "text-primary bg-blue-50 border-l-2 border-primary"
                    : "text-gray-600 hover:text-primary hover:bg-gray-50"
                )}
              >
                {item.icon}
                {item.label}
              </a>
            </Link>
          ))}
        </nav>
        <div className="flex-shrink-0 p-4 border-t border-gray-200">
          {isLoading ? (
            <div className="flex items-center">
              <div className="h-9 w-9 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="ml-3">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 w-32 bg-gray-200 rounded mt-1 animate-pulse"></div>
              </div>
            </div>
          ) : user ? (
            <div className="flex items-center">
              <div className="h-9 w-9 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium">
                {user.avatarInitials}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user.displayName}</p>
                <p className="text-xs font-medium text-gray-500">{user.role}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center">
              <div className="h-9 w-9 rounded-full bg-gray-300 flex items-center justify-center text-white font-medium">
                ?
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">Guest User</p>
                <p className="text-xs font-medium text-gray-500">Not signed in</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
