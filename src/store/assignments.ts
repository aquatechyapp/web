import { create } from 'zustand';

import { Assignment } from '../interfaces/Assignments';

type AssignmentsState = {
  assignments: {
    initial: Assignment[];
    current: Assignment[];
  };
  setAssignments: ({ initial, current }: { initial: Assignment[]; current: Assignment[] }) => void;
  assignmentToTransfer: Assignment[];
  setAssignmentToTransfer: (assignment: Assignment[]) => void;
  allAssignments: Assignment[];
  setAllAssignments: (assignments: Assignment[]) => void;
};

export const useAssignmentsStore = create<AssignmentsState>((set) => ({
  assignments: {
    initial: [],
    current: []
  },
  setAssignments: ({ initial, current }) => set({ assignments: { initial, current } }),
  assignmentToTransfer: [],
  setAssignmentToTransfer: (assignment) => set({ assignmentToTransfer: assignment }),
  allAssignments: [],
  setAllAssignments: (assignments) => set({ allAssignments: assignments })
}));
