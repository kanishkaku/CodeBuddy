import type { NavigationItem } from '../NavBar/NavBar';
import { routes } from 'wasp/client/router';

export function getAppNavigationItems(isUserSubscribed: boolean): NavigationItem[] {
  return [
    { name: 'Dashboard', to: routes.DashboardRoute.to },
    // Only show Pricing if not subscribed
    ...(!isUserSubscribed ? [{ name: 'Pricing', to: routes.PricingPageRoute.to }] : []),
    { name: 'Open Tasks', to: routes.TasksRoute.to },
    { name: 'Resume', to: routes.ResumeRoute.to },
  ];
}
