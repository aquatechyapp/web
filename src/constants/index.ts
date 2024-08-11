import { Libraries } from '@react-google-maps/api';
import { CheckSquare, CircleUser } from 'lucide-react';

import ClientIcon from '@/components/ui/client-icon';
import RouteIcon from '@/components/ui/route-icon';
import TabIcon from '@/components/ui/tab-icon';
import TeamIcon from '@/components/ui/team-icon';

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

type Menu = {
  text: string;
  href: string;
  submenu?: Record<string, { text: string; href: string }>;
  icon: React.FC;
};

export const routes: Menu[] = [
  {
    text: 'Dashboard',
    href: '/dashboard',
    icon: TabIcon
  },
  {
    text: 'Clients',
    href: '/clients',
    submenu: {
      clients: {
        text: 'Clients',
        href: '/clients'
      },
      addClients: {
        text: 'Add Clients',
        href: '/clients/new'
      },
      import: {
        text: 'Import',
        href: '/clients/import'
      },
      broadcast: {
        text: 'Broadcast',
        href: '/clients/broadcast'
      }
    },
    icon: ClientIcon
  },
  {
    text: 'Routes',
    href: '/routes',
    icon: RouteIcon
  },
  {
    text: 'Requests',
    href: '/requests',
    icon: CheckSquare
  },
  {
    text: 'My team',
    submenu: {
      myAccount: {
        text: 'My team',
        href: '/team'
      },
      generateReports: {
        text: 'Generate Reports',
        href: '/team/generateReports'
      }
    },
    href: '/team',
    icon: TeamIcon
  },
  {
    text: 'My Account',
    submenu: {
      profile: {
        text: 'Profile',
        href: '/account'
      },
      subscription: {
        text: 'Subscription',
        href: '/account/subscription'
      },
      invoices: {
        text: 'Invoices',
        href: '/account/invoices'
      }
    },
    href: '/account',
    icon: CircleUser
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
