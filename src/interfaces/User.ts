import { LanguageOptions, SubcontractorStatus } from '@/constants/enums';

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
};

export interface User extends BasicData {
  employers: WorkRelation[];
  createdAt: string;
  subcontractors: WorkRelation[];
}

export type WorkRelation = {
  id: string;
  companyId: string;
  paymentType: string;
  paymentValue: number;
  subcontractorId: string;
  status: SubcontractorStatus;
  createdAt: string;
  company: BasicData;
  subcontractor: BasicData;
};
