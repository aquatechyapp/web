import { Frequency } from '@/ts/enums/enums';

import { Pool } from './Pool';

export type Assignment = {
  id: string;
  assignmentOwnerId: string;
  assignmentToId: string;
  createdAt: string;
  endAfter: string | Date;
  frequency: Frequency;
  order: number;
  poolId: string;
  skipDates: string[];
  startOn: string | Date;
  weekday: string;
  status: 'Active' | 'Inactive';
  pool: Pool;
  timezone?: string | null | undefined;
  serviceType?: {
    id: string;
    name: string;
  };
  timeInMinutesToNextStop?: number | null;
  distanceInMilesToNextStop?: number | null;
};

export type CreateAssignment = {
  assignmentToId: string;
  poolId: string;
  serviceTypeId: string;
  weekday: string;
  frequency: string;
  startOn: Date;
  endAfter: Date | string;
};

export type TransferAssignment = {
  assignmentId: string;
  assignmentToId: string;
  startOn: Date;
  endAfter: Date | string;
  weekday: string;
};
