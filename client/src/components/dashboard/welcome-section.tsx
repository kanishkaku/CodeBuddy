import { useQuery } from "@tanstack/react-query";

export default function WelcomeSection() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/current-user"],
  });

  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="h-5 w-96 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h1 className="text-2xl font-semibold text-gray-900">
        Welcome back, {user?.displayName.split(' ')[0] || 'User'}!
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Continue building your resume with open source contributions.
      </p>
    </div>
  );
}
