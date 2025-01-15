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
  pool: Pool;
  timezone?: string | null | undefined;
};

export type CreateAssignment = {
  assignmentToId: string;
  poolId: string;
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
