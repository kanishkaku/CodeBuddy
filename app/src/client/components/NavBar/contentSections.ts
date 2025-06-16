import type { NavigationItem } from '../NavBar/NavBar';
import { routes } from 'wasp/client/router';

export const appNavigationItems: NavigationItem[] = [
  { name: 'Dashboard', to: routes.DashboardRoute.to },
  { name: 'Open Tasks', to: routes.TasksRoute.to },
  { name: 'Resume', to: routes.ResumeRoute.to },
];
