import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import ExploreTasks from "@/pages/explore-tasks";
import MyResume from "@/pages/my-resume";
import SavedTasks from "@/pages/saved-tasks";
import LearningCenter from "@/pages/learning-center";
import HelpCenter from "@/pages/help-center";
import Login from "@/pages/login";
import Landing from "@/pages/landing";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { AuthProvider, useAuth } from "@/hooks/use-auth";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <Header />
        <main className="flex-1 relative overflow-y-auto py-6 bg-gray-50">
          <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function Router() {
  const { user, profile, isLoading } = useAuth()
  
  // Public routes that don't require authentication checks
  const publicRoutes = (
    <Switch>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/">
        <Landing />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );

  // Protected routes that require authentication
  const authenticatedRoutes = (
    <Switch>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/">
        <Layout>
          <Dashboard />
        </Layout>
      </Route>
      <Route path="/explore-tasks">
        <Layout>
          <ExploreTasks />
        </Layout>
      </Route>
      <Route path="/my-resume">
        <Layout>
          <MyResume />
        </Layout>
      </Route>
      <Route path="/saved-tasks">
        <Layout>
          <SavedTasks />
        </Layout>
      </Route>
      <Route path="/learning-center">
        <Layout>
          <LearningCenter />
        </Layout>
      </Route>
      <Route path="/help-center">
        <Layout>
          <HelpCenter />
        </Layout>
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
  
  // Show loading state only when checking authentication for protected routes
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }
  
  // If not logged in, show public routes
  if (!user || !profile) {
    return publicRoutes;
  }
  
  // For authenticated users, show authenticated routes
  return authenticatedRoutes;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
