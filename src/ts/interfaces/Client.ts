import { ClientType, IanaTimeZones } from '@/ts/enums/enums';

import { Pool } from './Pool';
import { Company } from './Company';

export interface Client {
  id: string;
  address: string;
  city: string;
  company: string;
  customerCode: string;
  createdAt: string;
  deactivatedAt: string;
  email: string;
  secondaryEmail?: string;
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
  companyOwnerId: string;
  companyOwner: Company;
  zip: string;
  pools: Pool[];
  lastServiceDate: string;
  type: ClientType;
  timezone: IanaTimeZones;
  status: string;
  preferences?: {
    serviceEmailPreferences: {
      sendEmails: boolean;
      attachChemicalsReadings: boolean;
      attachChecklist: boolean;
      attachServicePhotos: boolean;
      sendFilterCleaningEmails: boolean;
    };
  };
}
