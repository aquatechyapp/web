import { Pool } from './Assignments';
import { Client } from './Client';

export interface Request {
  createdBy: CreatedBy;
  id: string;
  category: string;
  clientId: string;
  addressedTo: string;
  poolId: string;
  createdAt: string;
  description: string;
  status: 'Pending' | 'Processing' | 'Done';
  updatedAt: string;
  outcome: string;
  photos: string[];
  pool: Pool;
  client: Client;
}
export interface Services {
  createdBy: CreatedBy;
  id: string;
  category: string;
  clientId: string;
  addressedTo: string;
  poolId: string;
  createdAt: string;
  description: string;
  status: 'Pending' | 'Processing' | 'Done';
  updatedAt: string;
  outcome: string;
  photos: string[];
  pool: Pool;
  client: Client;

  // Novos campos que você mencionou
  acidSpent: string | 'N/A'; // Para valores de string ou 'N/A'
  alkalinity: string | 'N/A';
  calcium: string | 'N/A';
  checklistFilterWashed: boolean | null;
  checklistPoolVacuumed: boolean | null;
  checklistPumpBasket: boolean | null;
  checklistSkimmer: boolean | null;
  checklistTilesBrushed: boolean | null;
  checklistWaterTested: boolean | null;
  chlorine: string | 'N/A'; // Para valores de string ou 'N/A'
  chlorineSpent: string | 'N/A';
  cyanAcid: string | 'N/A';
  ph: string | 'N/A'; // Para valores de string ou 'N/A'
  phosphateSpent: string | 'N/A';
  salt: string | 'N/A';
  saltSpent: string | 'N/A';
  shockSpent: string | 'N/A';
  tabletSpent: string | 'N/A';

  // Dados adicionais
  doneByUser: {
    id: string;
    firstName: string;
    lastName: string;
    company: string;
  };
}

export interface CreateRequest {
  createdBy: CreatedBy;
  id: string;
  category: string;
  clientId: string;
  addressedTo: string;
  poolId: string;
  createdAt: string;
  description: string;
  status: 'Pending' | 'Processing' | 'Done';
  updatedAt: string;
  outcome: string;
  photo: string[];
  pool: Pool;
  client: Client;
}

export interface CreatedBy {
  id: string;
  firstName: string;
  lastName: string;
  company: string;
}
