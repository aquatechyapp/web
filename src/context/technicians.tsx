import { createContext, useContext, useEffect, useState } from 'react';

import { WorkRelation } from '../interfaces/User';
import { isEmpty } from '../utils';
import { useUserContext } from './user';

type TechniciansContextType = {
  assignmentToId: string;
  setAssignmentToId: (assignmentToId: string) => void;
  technicians: WorkRelation[];
  setTechnicians: (data: WorkRelation[]) => void;
};

const TechniciansContext = createContext<TechniciansContextType>({
  assignmentToId: '',
  setAssignmentToId: () => {},
  technicians: [],
  setTechnicians: () => {}
});

export const TechniciansProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUserContext();
  const [assignmentToId, setAssignmentToId] = useState(user?.id || '');
  const [technicians, setTechnicians] = useState<WorkRelation[]>([]);

  useEffect(() => {
    if (!user || isEmpty(user)) return;

    setAssignmentToId(user.id);
    setTechnicians([
      {
        subcontractor: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName
        }
      },
      ...user.subcontractors.filter((sub) => sub.status === 'Active')
    ]);
  }, [user]);

  return (
    <TechniciansContext.Provider value={{ technicians, setTechnicians, assignmentToId, setAssignmentToId }}>
      {children}
    </TechniciansContext.Provider>
  );
};

export const useTechniciansContext = () => useContext(TechniciansContext);
