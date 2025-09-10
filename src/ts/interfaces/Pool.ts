import { EquipmentCondition, FilterType, MaintenanceType, PoolType } from '@/ts/enums/enums';

import { Service } from './Service';
import { Client } from './Client';
import { Assignment } from './Assignments';
import { ChecklistTemplate, Company } from './Company';
import { Request } from './Request';

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
  equipment?: Equipment | null;
  checklistTemplates?: ChecklistTemplate[];
};

// Used only to add a pool to a client

export type CreatePool = {
  address: string;
  animalDanger: boolean;
  city: string;
  clientOwnerId: string;
  enterSide?: string | null;
  lockerCode?: string | null;
  monthlyPayment?: number;
  notes?: string;
  poolType: PoolType;
  state: string;
  zip: string;
};

export type Coords = {
  lat: number;
  lng: number;
};

export interface MaintenanceHistory {
  date: Date;
  type?: MaintenanceType;
  userId: string;
  notes?: string;
  photos?: string[];
}

export interface Filter {
  model?: string;
  photos?: string[];
  serialNumber?: string;
  type?: FilterType;
  lastCleaningDate?: Date;
  replacementDate?: Date;
  lastCleaningUserId?: string;
  condition?: EquipmentCondition;
  maintenanceHistory?: MaintenanceHistory[];
  recommendedCleaningIntervalDays?: number;
  warrantyExpirationDate?: Date;
}

export interface Equipment {
  filter?: Filter | null;
}

// Request interface is now imported from Request.ts
