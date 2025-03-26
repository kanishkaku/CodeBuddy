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
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

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
  return (
    <Switch>
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
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
