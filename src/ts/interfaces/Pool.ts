import { PoolType } from '@/ts/enums/enums';

import { Service } from './Service';
import { Client } from './Client';
import { Assignment } from './Assignments';
import { Company } from './Company';

export type Pool = {
  id: string;
  address: string;
  animalDanger: boolean;
  city: string;
  clientOwnerId: string;
  clientOwner?: Client;
  companyOwnerId: string;
  companyOwner?: Company;
  coords: Coords;
  createdAt: Date;
  deactivatedAt: string;
  enterSide: string;
  isActive: boolean;
  lockerCode?: string;
  monthlyPayment?: number;
  name: string;
  notes?: string;
  poolType: PoolType;
  state: string;
  updatedAt?: Date;
  zip: string;
  timezone: string;
  services?: Service[];
  assignments?: Assignment[];
  requests?: Request[];
};

type Coords = {
  lat: number;
  lng: number;
};
