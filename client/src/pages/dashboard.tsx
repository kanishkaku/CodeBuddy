import WelcomeSection from "@/components/dashboard/welcome-section";
import StatsSection from "@/components/dashboard/stats-section";
import RecommendedTasks from "@/components/dashboard/recommended-tasks";
import ResourcesSection from "@/components/dashboard/resources-section";
import ResumeSection from "@/components/dashboard/resume-section";

export default function Dashboard() {
  return (
    <>
      <WelcomeSection />
      <StatsSection />
      <RecommendedTasks />
      <ResourcesSection />
      <ResumeSection />
    </>
  );
}
