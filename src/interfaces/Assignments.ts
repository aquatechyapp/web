import { PoolType } from '@/constants/enums';

import { Service } from './Service';

export type TransferAssignment = Assignment & {
  endAfter: Date;
  startOn: Date;
};

export type Assignment = {
  id: string;
  assignmentOwnerId: string;
  assignmentToId: string;
  createdAt: string;
  endAfter: string;
  frequency: string;
  order: number;
  poolId: string;
  skipDates: string[];
  startOn: string;
  weekday: string;
  pool: Pool;
  paidByService: number | null;
};

export type CreateAssignment = {
  assignmentToId: string;
  poolId: string;
  weekday: string;
  frequency: string;
  startOn: Date;
  endAfter: Date;
  paidByService: number;
};

export type Pool = {
  id: string;
  address: string;
  animalDanger: boolean;
  city: string;
  clientOwnerId: string;
  createdAt: string;
  deactivatedAt: string;
  enterSide: string;
  isActive: boolean;
  lockerCode: string;
  monthlyPayment: number;
  name: string;
  notes: string;
  poolType: PoolType;
  state: string;
  updatedAt: string;
  userOwnerId: string;
  zip: string;
  photos: string[];
  coords: Coords;
  services: Service[];
};

type Coords = {
  lat: number;
  lng: number;
};
