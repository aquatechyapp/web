import { Pool } from './Assignments';

export interface Client {
  id: string;
  address: string;
  city: string;
  company: string;
  customerCode: string;
  createdAt: string;
  deactivatedAt: string;
  email1: string;
  invoiceEmail: string;
  isActive: boolean;
  name: string;
  notes: string;
  phone1: string;
  state: string;
  updatedAt: string;
  userOwnerId: string;
  zip: string;
  pools: Pool[];
  lastServiceDate: string;
  type: 'Residential' | 'Commercial';
}

export interface Coords {
  lat: number;
  lng: number;
}

export interface ImportMultipleClients {
  clientAddress?: string;
  clientCity?: string;
  email1?: string;
  clientName?: string;
  clientNotes?: string;
  phone1?: string;
  clientState?: string;
  clientZip?: string;
  poolAddress?: string;
  animalDanger?: boolean;
  poolCity?: string;
  enterSide?: string;
  lockerCode?: string;
  poolNotes?: string;
  poolType?: string;
  poolState?: string;
  poolZip?: string;
  customerCode?: string;
  clientCompany?: string;
  clientType?: string;
  monthlyPayment?: number;
}
