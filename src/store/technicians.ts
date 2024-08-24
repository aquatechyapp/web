import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { WorkRelation } from '../ts/interfaces/User';

type Store = {
  assignmentToId: string;
  technicians: WorkRelation[];
};

type Actions = {
  setAssignmentToId: (assignmentToId: string) => void;
  setTechnicians: (data: WorkRelation[]) => void;
};

export const useTechniciansStore = create<Store & Actions>()(
  devtools((set) => ({
    assignmentToId: '',
    setAssignmentToId: (assignmentToId: string) => set({ assignmentToId }),
    technicians: [],
    setTechnicians: (data: WorkRelation[]) => set({ technicians: data })
  }))
);
