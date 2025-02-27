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
      attachServiceNotes: boolean;
      attachServicePhotos: boolean;
      ccEmail: string;
    };
  };
  imageUrl?: string | null;
}

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
