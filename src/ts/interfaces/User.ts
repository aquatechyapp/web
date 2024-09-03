import { LanguageOptions, SubcontractorStatus, UserSubscription } from '@/ts/enums/enums';

export type BasicData = {
  id: string;
  language: LanguageOptions;
  firstName: string;
  lastName: string;
  company: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  incomeAsACompany: number;
  incomeAsASubcontractor: number;
  userPreferences: {
    serviceEmailPreferences: {
      sendEmails: boolean;
      attachChemicalsReadings: boolean;
      attachChecklist: boolean;
      attachServiceNotes: boolean;
      attachServicePhotos: boolean;
      ccEmail: string;
    };
  };
};

export interface User extends BasicData {
  workRelationsAsAEmployer: WorkRelation[];
  createdAt: string;
  workRelationsAsASubcontractor: WorkRelation[];
  subscription: UserSubscription;
  poolsCount: number;
}

export type WorkRelation = {
  id: string;
  companyId: string;
  paymentType: string;
  paymentValue: number;
  subcontractorId: string;
  status: SubcontractorStatus;
  createdAt: string;
  company: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    company: string;
  };
  subcontractor: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    company: string;
  };
};
