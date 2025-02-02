import { LanguageOptions, UserSubscription } from '@/ts/enums/enums';
import { Company } from './Company';

export type UserCompany = {
  companyId: string;
  id: string;
  role: string;
  status: string;
  userId: string;
};

export type BasicData = {
  id: string;
  language: LanguageOptions;
  firstName: string;
  lastName: string;
  company: string;
  userCompanies?: UserCompany[];
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
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
  createdAt: string;
  subscription: UserSubscription;
  poolsCount: number;
}
