import { createContext, useCallback, useContext, useState } from 'react';

const FormContext = createContext({
  forms: [],
  updateFormValues: () => {},
  removeForm: () => {}
});

export const useFormContext = () => useContext(FormContext);

export const FormProvider = ({ children }) => {
  const [forms, setForms] = useState([]);

  const updateFormValues = (index: number, values) => {
    setForms((prevForms) => {
      const newForms = [...prevForms];
      newForms[index] = values;
      return newForms;
    });
  };

  const removeForm = (index: number) => {
    setForms((prevForms) => prevForms.filter((_, i) => i !== index));
  };

  return <FormContext.Provider value={{ forms, updateFormValues, removeForm }}>{children}</FormContext.Provider>;
};
