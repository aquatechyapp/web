export type BasicData = {
  id: string;
  language: string;
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

export type User = BasicData & {
  employers: WorkRelation[];
  createdAt: string;
  subcontractors: WorkRelation[];
};

export type WorkRelation = {
  id: string;
  companyId: string;
  paymentType: string;
  paymentValue: number;
  subcontractorId: string;
  status: string;
  createdAt: string;
  company: BasicData;
  subcontractor: BasicData;
};
