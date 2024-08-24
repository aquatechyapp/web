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
