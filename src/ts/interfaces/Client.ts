import { ClientType, IanaTimeZones } from '@/ts/enums/enums';

import { Pool } from './Pool';

export interface Client {
  id: string;
  address: string;
  city: string;
  company: string;
  customerCode: string;
  createdAt: string;
  deactivatedAt: string;
  email: string;
  invoiceEmail: string;
  isActive: boolean;
  firstName: string;
  lastName: string;
  fullName: string;
  notes: string;
  phone: string;
  state: string;
  updatedAt: string;
  userOwnerId: string;
  zip: string;
  pools: Pool[];
  lastServiceDate: string;
  type: ClientType;
  timezone: IanaTimeZones;
}
