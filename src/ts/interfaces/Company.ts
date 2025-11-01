import { ReadingGroup } from './ReadingGroups';
import { ConsumableGroup } from './ConsumableGroups';
import { ServiceType } from './ServiceTypes';
import { ChecklistTemplate } from './ChecklistTemplates';
import { Coords } from './Pool';

type Status = 'Active' | 'Inactive';

export type CompanyMember = {
  status: Status;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'Owner' | 'Admin' | 'Office' | 'Technician' | 'Cleaner';
  company: {
    id: string;
    name: string;
  };
  address: string;
  city: string;
  state: string;
  zip: string;
  addressCoords?: Coords;
};

export interface Company {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  createdAt: string;
  updatedAt: string;
  status: Status;
  preferences: {
    serviceEmailPreferences: {
      sendEmails: boolean;
      attachChemicalsReadings: boolean;
      attachChecklist: boolean;
      attachServicePhotos: boolean;
      ccEmail: string;
      sendFilterCleaningEmails: boolean;

      // New fields
      attachReadingsGroups: boolean;
      attachConsumablesGroups: boolean;
      attachPhotoGroups: boolean;
      attachSelectorsGroups: boolean;
      attachCustomChecklist: boolean;
    };
    equipmentMaintenancePreferences: {
      filterCleaningIntervalDays: number;
      filterReplacementIntervalDays: number;
      filterCleaningMustHavePhotos: boolean;
    };
  };
  imageUrl?: string | null;
  checklistTemplates: ChecklistTemplate[];
  readingGroups?: ReadingGroup[];
  consumableGroups?: ConsumableGroup[];
  serviceTypes?: ServiceType[];
}

// ChecklistTemplate and ChecklistTemplateItem are now imported from ChecklistTemplates.ts

export interface CreateCompany {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

export interface UpdateCompany {
  companyId: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  status: Status;
}

export interface UpdateCompanyLogo {
  companyId: string;
  logo: File;
}

export interface InviteMember {
  userInvitedEmail: string;
  companyId: string;
  role: 'Owner' | 'Admin' | 'Office' | 'Technician' | 'Cleaner';
  firstName?: string | null;
  lastName?: string | null;
  company?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  userAlreadyExists: boolean;
}

export interface AcceptInvitation {
  userCompanyId: string;
  status: Status;
}

export interface CompanyWithMyRole extends Company {
  role?: 'Owner' | 'Admin' | 'Office' | 'Technician' | 'Cleaner';
  status: Status;
  userCompanyId: string;
}
