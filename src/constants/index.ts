import { Libraries } from '@react-google-maps/api';
import {
  CheckSquare,
  CircleDollarSign,
  CircleUser,
  FileBarChartIcon,
  Import,
  ListChecks,
  Mails,
  Settings2,
  UserPlus,
  Users,
  PlayCircle,
  DollarSign
} from 'lucide-react';

import RouteIcon from '@/components/ui/route-icon';
import TabIcon from '@/components/ui/tab-icon';
import TeamIcon from '@/components/ui/team-icon';

import { Frequency } from '@/ts/enums/enums';
import { Menu } from '@/ts/interfaces/Others';

export const Frequencies = [
  {
    value: Frequency.WEEKLY,
    name: 'Weekly',
    key: 'Weekly'
  },
  {
    value: Frequency.E2WEEKS,
    name: 'Each 2 weeks',
    key: 'Each2Weeks'
  },
  {
    value: Frequency.E3WEEKS,
    name: 'Each 3 weeks',
    key: 'Each3Weeks'
  },
  {
    value: Frequency.E4WEEKS,
    name: 'Each 4 weeks',
    key: 'Each4Weeks'
  },
  {
    value: Frequency.ONCE,
    name: 'Only once',
    key: 'OnlyOnce'
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

export const routes: Menu[] = [
  {
    text: 'Quick Start',
    href: '/quickstart',
    icon: PlayCircle,
    title: 'Quick Start Guide',
    description: 'Get started with Aquatechy in a few simple steps'
  },
  {
    text: 'Dashboard',
    href: '/dashboard',
    icon: TabIcon,
    title: 'Dashboard',
    description: 'Overview of your pools as a technician or a manager'
  },
  {
    title: 'Clients',
    text: 'Clients',
    href: '/clients',
    description: 'Manage your clients and edit their information',
    submenu: {
      clients: {
        text: 'My Clients',
        href: '/clients',
        title: 'My Clients'
      },
      addClients: {
        text: 'New Client',
        href: '/clients/new',
        title: 'New Client',
        description: 'Create a new client, add a pool and assign a technician to it',
        icon: UserPlus
      },
      importQuickbooks: {
        text: 'QuickBooks Import',
        href: '/clients/import-quickbooks',
        title: 'Import Clients from QuickBooks',
        icon: Import,
        description: 'Import clients from a QuickBooks file'
      },
      importCSV: {
        text: 'CSV Import',
        href: '/clients/import-csv',
        title: 'Import Clients from CSV',
        icon: Import,
        description: 'Import clients using our CSV template'
      },
      importSkimmer: {
        text: 'Skimmer Import',
        href: '/clients/import-skimmer',
        title: 'Import Clients from Skimmer',
        icon: Import,
        description: 'Import clients from Skimmer Excel file'
      }
    },
    icon: Users
  },
  {
    text: 'Routes',
    submenu: {
      routes: {
        text: 'Assignments',
        href: '/routes/assignments',
        title: 'Assignments',
        description: 'Create assignments, manage your routes and see your schedule'
      },
      schedule: {
        text: 'Schedule',
        href: '/routes/schedule',
        title: 'Schedule',
        description: 'See your schedule and the pools you have to service',
        icon: UserPlus
      },
      routeFinder: {
        text: 'Route Finder',
        href: '/routes/route-finder',
        title: 'Route Finder',
        description: 'Find the best route for a new pool location',
        icon: RouteIcon
      }
    },
    href: '/routes/assignments',
    icon: RouteIcon,
    title: 'Assignments',
    description: 'Create assignments, manage your routes and see your schedule'
  },
  {
    text: 'Requests',
    href: '/requests',
    icon: CheckSquare,
    title: 'Requests',
    description: 'Manage your requests and see their status'
  },
  {
    text: 'Services',
    href: '/services',
    icon: ListChecks,
    title: 'Services',
    description: 'Look services made by your company'
  },
  {
    text: 'Reports',
    href: '/reports',
    icon: FileBarChartIcon,
    title: 'Reports',
    description: 'Generate comprehensive reports and analytics',
    submenu: {
      clientReports: {
        text: 'Client Reports',
        href: '/reports/clients',
        title: 'Client Reports',
        description: 'Client activity and pool maintenance reports',
        icon: Users
      },
      serviceReports: {
        text: 'Service Reports',
        href: '/reports/services',
        title: 'Service Reports',
        description: 'Service completion and technician reports',
        icon: ListChecks
      },
      teamReports: {
        text: 'Team Reports',
        href: '/reports/team',
        title: 'Team Reports',
        description: 'Team performance and productivity reports',
        icon: UserPlus
      }
    }
  },
  {
    text: 'My team',
    submenu: {
      myAccount: {
        text: 'My team',
        href: '/team',
        title: 'My team',
        description: 'Manage your team and add new technicians'
      },
      myCompanies: {
        text: 'My companies',
        href: '/team/myCompanies',
        title: 'My companies',
        description: 'Manage your companies and edit their information.'
      }
      // generateReports: {
      //   text: 'Generate Reports',
      //   href: '/team/generateReports',
      //   title: 'Generate Service and Payment Reports',
      //   description: 'Select who you want to generate a report from and select an interval.',
      //   icon: FileBarChartIcon
      // }
    },
    href: '/team',
    icon: TeamIcon,
    title: 'My team',
    description: 'Manage your team and add new technicians'
  },
  {
    text: 'My Account',
    description: 'Edit your profile information',
    submenu: {
      profile: {
        text: 'Profile',
        href: '/account',
        title: 'Profile'
      },
      subscription: {
        text: 'Subscription',
        href: '/account/subscription',
        title: 'Subscription',
        icon: CircleDollarSign,
        description: 'Manage your subscription and see our plans'
      }
    },
    href: '/account',
    icon: CircleUser,
    title: 'My Account'
  },
  {
    text: 'Invoices',
    href: '/invoices',
    icon: DollarSign,
    title: 'Invoices',
    description: 'View and manage all your invoices in one place',
    submenu: {
      invoices: {
        text: 'Invoices',
        href: '/invoices',
        title: 'Invoices',
        icon: DollarSign,
        description: 'View and manage all invoices',
      },
      subscription: {
        text: 'Recurring Invoices',
        href: '/invoices/recurring',
        title: 'Recurring Invoices',
        icon: DollarSign,
        description: 'Manage recurring invoice templates and schedules',
      }
    },
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

export const RequestStatus = [
  {
    value: 'Pending',
    name: 'Pending',
    key: 'Pending'
  },
  {
    value: 'Processing',
    name: 'Processing',
    key: 'Processing'
  },
  {
    value: 'Done',
    name: 'Done',
    key: 'Done'
  }
];

export const Categories = [

  {
    value: 'other',
    name: 'Other',
    key: 'other'
  },
  {
    value: 'filterCleaning',
    name: 'Filter Cleaning',
    key: 'filterCleaning'
  },
  {
    value: 'filterReplacement',
    name: 'Filter Replacement',
    key: 'filterReplacement'
  }
];

export const libraries: Libraries = ['places'];
