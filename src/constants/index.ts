import { AvatarIcon } from '@radix-ui/react-icons';

import ClientIcon from '@/components/ui/client-icon';
import RouteIcon from '@/components/ui/route-icon';
import TabIcon from '@/components/ui/tab-icon';
import TeamIcon from '@/components/ui/team-icon';

export const ACCESS_TOKEN_COOKIE_NAME = 'accessToken';
export const USER_COOKIE_NAME = 'user';

export const Frequencies = [
  {
    value: 'MONTHLY',
    name: 'Monthly',
    key: 'Monthly'
  },
  {
    value: 'TRIWEEKLY',
    name: 'Three-Weeks',
    key: 'Three-Weeks'
  },
  {
    value: 'BIWEEKLY',
    name: 'Bi-Weekly',
    key: 'Bi-Weekly'
  },
  {
    value: 'WEEKLY',
    name: 'Weekly',
    key: 'Weekly'
  }
];

export const Weekdays = [
  {
    value: 'SUNDAY',
    name: 'Sunday',
    key: 'Sunday'
  },
  {
    value: 'MONDAY',
    name: 'Monday',
    key: 'Monday'
  },
  {
    value: 'TUESDAY',
    name: 'Tuesday',
    key: 'Tuesday'
  },
  {
    value: 'WEDNESDAY',
    name: 'Wednesday',
    key: 'Wednesday'
  },
  {
    value: 'THURSDAY',
    name: 'Thursday',
    key: 'Thursday'
  },
  {
    value: 'FRIDAY',
    name: 'Friday',
    key: 'Friday'
  },
  {
    value: 'SATURDAY',
    name: 'Saturday',
    key: 'Saturday'
  }
];

export const PoolTypes = [
  {
    value: 'Chlorine',
    name: 'Chlorine',
    key: 'Chlorine'
  },
  {
    value: 'Salt',
    name: 'Salt',
    key: 'Salt'
  },
  {
    value: 'Other',
    name: 'Other',
    key: 'Other'
  }
];

export const routes = [
  {
    text: 'Dashboard',
    href: '/dashboard',
    icon: TabIcon
  },
  {
    text: 'Clients',
    submenu: {
      clients: {
        text: 'Clients',
        href: '/clients'
      },
      addClients: {
        text: 'Add Clients',
        href: '/clients/new'
      }
    },
    href: '',
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
    text: 'My Account',
    submenu: {
      myAccount: {
        text: 'My Account',
        href: '/account'
      },
      generateReports: {
        text: 'Generate Reports',
        href: '/generateReports'
      }
    },
    href: '',
    icon: AvatarIcon
  }
];

export const paymentType = [
  {
    key: 'valueFixedByPool',
    value: 'valueFixedByPool',
    name: 'Fixed value by pool'
  },
  {
    key: 'percentageFixedByPool',
    value: 'percentageFixedByPool',
    name: '% fixed by pool'
  },
  { key: 'customized', value: 'customized', name: 'Custom' }
];
