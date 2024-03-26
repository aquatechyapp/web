import ClientIcon from '@/app/_components/ui/client-icon';
import RouteIcon from '@/app/_components/ui/route-icon';
import TabIcon from '@/app/_components/ui/tab-icon';
import TeamIcon from '@/app/_components/ui/team-icon';
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
