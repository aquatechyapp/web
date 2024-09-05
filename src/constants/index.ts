import { Libraries } from '@react-google-maps/api';
import {
  CheckSquare,
  CircleDollarSign,
  CircleUser,
  FileBarChartIcon,
  Import,
  Mails,
  Settings2,
  UserPlus,
  Users
} from 'lucide-react';

import RouteIcon from '@/components/ui/route-icon';
import TabIcon from '@/components/ui/tab-icon';
import TeamIcon from '@/components/ui/team-icon';
import { Menu } from '@/ts/interfaces/Others';

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

export const routes: Menu[] = [
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
      import: {
        text: 'Import Clients',
        href: '/clients/import',
        title: 'Import Clients',
        icon: Import,
        description: 'Massive import and edit of clients from a CSV file'
      },
      broadcast: {
        text: 'Broadcast',
        href: '/clients/broadcast',
        title: 'Broadcast',
        description: 'Send a message to all clients',
        icon: Mails
      }
    },
    icon: Users
  },
  {
    text: 'Routes',
    href: '/routes',
    icon: RouteIcon,
    title: 'Routes',
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
    text: 'My team',
    submenu: {
      myAccount: {
        text: 'My team',
        href: '/team',
        title: 'My team'
      },
      generateReports: {
        text: 'Generate Reports',
        href: '/team/generateReports',
        title: 'Generate Service and Payment Reports',
        description: 'Select who you want to generate a report from and select an interval.',
        icon: FileBarChartIcon
      }
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
      },
      preferences: {
        text: 'Preferences',
        href: '/account/preferences',
        title: 'Preferences',
        description: 'Edit your preferences of e-mails and notifications',
        icon: Settings2
      }
    },
    href: '/account',
    icon: CircleUser,
    title: 'My Account'
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
    value: 'equipmentMalfunctions',
    name: 'Equipment Malfunctions',
    key: 'EquipmentMalfunctions'
  },
  {
    value: 'waterChemistryImbalance',
    name: 'Water Chemistry Imbalance',
    key: 'WaterChemistryImbalance'
  },
  {
    value: 'algaeGrowth',
    name: 'Algae Growth',
    key: 'AlgaeGrowth'
  },
  {
    value: 'debrisAccumulation',
    name: 'Debris Accumulation',
    key: 'DebrisAccumulation'
  },
  {
    value: 'cloggedDrainsandSkimmers',
    name: 'Clogged Drains and Skimmers',
    key: 'CloggedDrainsandSkimmers'
  },
  {
    value: 'leaks',
    name: 'Leaks',
    key: 'Leaks'
  },
  {
    value: 'equipmentMaintenance',
    name: 'Equipment Maintenance',
    key: 'EquipmentMaintenance'
  },
  {
    value: 'waterClarityIssues',
    name: 'Water Clarity Issues',
    key: 'WaterClarityIssues'
  },
  {
    value: 'surfaceStains',
    name: 'Surface Stains',
    key: 'SurfaceStains'
  },
  {
    value: 'crackedorDamagedTiles',
    name: 'Cracked or Damaged Tiles',
    key: 'CrackedorDamagedTiles'
  },
  {
    value: 'pumpPrimingProblems',
    name: 'Pump Priming Problems',
    key: 'PumpPrimingProblems'
  },
  {
    value: 'equipmentCompatibility',
    name: 'Equipment Compatibility',
    key: 'EquipmentCompatibility'
  },
  {
    value: 'safetyConcerns',
    name: 'Safety Concerns',
    key: 'SafetyConcerns'
  },
  {
    value: 'waterLoss',
    name: 'Water Loss',
    key: 'WaterLoss'
  },
  {
    value: 'customerCommunication',
    name: 'Customer Communication',
    key: 'CustomerCommunication'
  }
];

export const libraries: Libraries = ['places'];
