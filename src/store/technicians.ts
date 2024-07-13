import { create } from 'zustand';

import { WorkRelation } from '../interfaces/User';

type TechniciansState = {
  assignmentToId: string;
  setAssignmentToId: (assignmentToId: string) => void;
  technicians: WorkRelation[];
  setTechnicians: (data: WorkRelation[]) => void;
};

export const useTechniciansStore = create<TechniciansState>((set) => ({
  assignmentToId: '',
  setAssignmentToId: (assignmentToId: string) => set({ assignmentToId }),
  technicians: [],
  setTechnicians: (data: WorkRelation[]) => set({ technicians: data })
}));
