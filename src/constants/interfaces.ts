export type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  photo?: string;
};

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
  montlyPayment: number;
  name: string;
  notes: string;
  poolType: string;
  state: string;
  updatedAt: string;
  userOwnerId: string;
  zip: string;
  photos: string[];
  assignments: Assignment[];
}

export interface Coords {
  lat: number;
  lng: number;
}

export interface Assignment {
  id: string;
  assignmentOwnerId: string;
  assignmentToId: string;
  endAfter: string;
  frequency: string;
  order: number;
  poolId: string;
  startOn: string;
  weekday: string;
}

export interface Service {
  id: string;
  assignmentId: string;
  chemicals: string;
  ph: string;
  poolId: string;
  temperature: string;
  time: string;
  photos: string[];
  createdAt: string;
  chlorine: string;
  chlorineSpent: string;
  salt: string;
  saltSpent: string;
  alkalinity: string;
  cyanAcid: string;
}
