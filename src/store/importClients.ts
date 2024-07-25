import { create } from 'zustand';

import { ImportMultipleClients } from '@/interfaces/Client';

type FormState = {
  forms: ImportMultipleClients[];
  updateFormValues: (index: number, values: ImportMultipleClients) => void;
  removeForm: (index: number) => void;
  cleanForms: () => void;
};

export const useFormStore = create<FormState>((set) => ({
  forms: [],
  updateFormValues: (index: number, values: ImportMultipleClients) =>
    set((state) => {
      const newForms = [...state.forms];
      newForms[index] = values;
      return { forms: newForms };
    }),
  removeForm: (index: number) =>
    set((state) => ({
      forms: state.forms.filter((_, i) => i !== index)
    })),
  cleanForms: () => set({ forms: [] })
}));
