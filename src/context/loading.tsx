import { createContext, useContext, useState } from 'react';

const LoadingContext = createContext({});

export const LoadingProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoadingContext = () => useContext(LoadingContext);
