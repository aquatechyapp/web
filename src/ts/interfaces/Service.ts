import { Client } from './Client';
import { Pool } from './Pool';

export interface Service {
  id: string;
  chemicalsSpent: ChemicalsSpent | null;
  chemicalsReading: ChemicalsReading | null;
  checklist: CheckList | null;
  clientOwnerId: string;
  clientOwner: Client;
  assignmentId: string;
  createdAt: string | null;
  completedByUserId: string | null;
  assignedToId: string;
  assignedTo: {
    id: string;
    firstName: string;
    lastName: string;
    company: string;
  };
  scheduledTo: string;
  notes: string | null;
  poolId: string;
  pool?: Pool;
  status: 'Open' | 'InProgress' | 'Completed' | 'Skipped';
  completedAt: string | null;
  photos: string[];
  companyOwnerId: string;
}

export interface ChemicalsSpent {
  liquidChlorine: number;
  muriaticAcid: number;
  cyanuricAcid: number;
  tablet: number;
  calcium: number;
  salt: number;
  shock: number;
  phosphateRemover: number;
}

export interface ChemicalsReading {
  chlorine: number;
  ph: number;
  alkalinity: number;
  cyanuricAcid: number;
  hardness: number;
  salt: number;
  phosphate: number;
}

export interface CheckList {
  poolVacuumed: boolean;
  skimmerCleaned: boolean;
  tilesBrushed: boolean;
  pumpBasketCleaned: boolean;
  filterWashed: boolean;
  filterChanged: boolean;
  chemicalsAdjusted: boolean;
}

export type CreateService = {
  assignedToId: string;
  poolId: string;
  scheduledTo: string;
};
