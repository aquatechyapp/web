import { Assignment } from './Assignments';
import { Service } from './Service';

export interface Client {
  id: string;
  address: string;
  city: string;
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
}

export interface Pool {
  coords: Coords;
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
  montlyPayment: string;
  name: string;
  notes: string;
  poolType: string;
  state: string;
  updatedAt: string;
  userOwnerId: string;
  zip: string;
  photos: string[];
  assignments: Assignment[];
  services: Service[];
}

export interface Coords {
  lat: number;
  lng: number;
}
