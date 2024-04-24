export interface DoneByUser {
  id: string;
  firstName: string;
  lastName: string;
  company: string;
}
export interface Service {
  id: string;
  acidSpent: string;
  alkalinity: string;
  assignmentId: string;
  calcium: string;
  checklistSkimmer: boolean;
  checklistTilesBrushed: boolean;
  checklistPumpBasket: boolean;
  checklistFilterWashed: boolean;
  chlorine: string;
  chlorineSpent: string;
  createdAt: string;
  cyanAcid: string;
  ph: string;
  phosphateSpent: string;
  poolId: string;
  salt: string;
  saltSpent: string;
  shockSpent: string;
  status: string;
  tabletSpent: string;
  photos: string[];
  doneByUser: DoneByUser;
}
