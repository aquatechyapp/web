import { createContext, useContext, useState } from 'react';

const FormContext = createContext({
  forms: {},
  updateFormValues: () => {},
  getAllFormValues: () => {}
});

export const useFormContext = () => useContext(FormContext);

export const FormProvider = ({ children }) => {
  const [forms, setForms] = useState({});

  const updateFormValues = (index, values) => {
    setForms((prevForms) => ({
      ...prevForms,
      [index]: values
    }));
  };

  const getAllFormValues = () => {
    return Object.values(forms);
  };

  console.log(forms);

  return <FormContext.Provider value={{ forms, updateFormValues, getAllFormValues }}>{children}</FormContext.Provider>;
};
