import { create } from 'zustand';

type FormState = {
  forms: any[];
  updateFormValues: (index: number, values: any) => void;
  removeForm: (index: number) => void;
  cleanForms: () => void;
};

export const useFormStore = create<FormState>((set) => ({
  forms: [],
  updateFormValues: (index: number, values: any) =>
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
