import { CompanyMember } from '@/ts/interfaces/Company';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type Store = {
  assignmentToId: string; // Assignment context
  assignedToId: string; // Services context
  members: CompanyMember[];
};

type Actions = {
  setAssignmentToId: (assignmentToId: string) => void;
  setAssignedToid: (assignedToId: string) => void;
  setMembers: (data: CompanyMember[]) => void;
  resetMembers: () => void;
};

export const useMembersStore = create<Store & Actions>()(
  devtools((set) => ({
    assignmentToId: '',
    setAssignmentToId: (assignmentToId: string) => set({ assignmentToId }),
    assignedToId: '',
    setAssignedToid: (assignedToId: string) => set({ assignedToId }),
    members: [],
    setMembers: (data: CompanyMember[]) => set({ members: data }),
    resetMembers: () => set({
      assignmentToId: '',
      assignedToId: '',
      members: []
    })
  }))
);
