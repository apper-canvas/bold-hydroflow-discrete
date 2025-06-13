import Dashboard from '@/components/pages/Dashboard';
import History from '@/components/pages/History';
import Settings from '@/components/pages/Settings';

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'Home',
    component: Dashboard
  },
  history: {
    id: 'history',
    label: 'History',
    path: '/history',
    icon: 'Calendar',
    component: History
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
    component: Settings
  }
};

export const routeArray = Object.values(routes);
export default routes;