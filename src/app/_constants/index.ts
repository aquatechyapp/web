import ClientIcon from '@/components/ui/client-icon';
import RouteIcon from '@/components/ui/route-icon';
import TabIcon from '@/components/ui/tab-icon';
import TeamIcon from '@/components/ui/team-icon';
import { AvatarIcon, DashboardIcon } from '@radix-ui/react-icons';

export const routes = [
  {
    text: 'Dashboard',
    href: '/dashboard',
    icon: TabIcon
  },
  {
    text: 'Clients',
    href: '/clients',
    icon: ClientIcon
  },
  {
    text: 'Routes',
    href: '/routes',
    icon: RouteIcon
  },
  {
    text: 'My team',
    href: '/team',
    icon: TeamIcon
  },
  {
    text: 'Integrations',
    href: '/integrations',
    icon: DashboardIcon
  },
  {
    text: 'My Account',
    href: '/account',
    icon: AvatarIcon
  }
];

// const settings = [
//   {
//     text: 'Help',
//     href: '/help',
//     icon: IoIosHelpCircleOutline
//   },
//   {
//     text: 'Settings',
//     href: '/settings',
//     icon: IoSettingsOutline
//   }
// ];
