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
  workRelationsAsAEmployer: WorkRelation[];
  createdAt: string;
  workRelationsAsASubcontractor: WorkRelation[];
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
