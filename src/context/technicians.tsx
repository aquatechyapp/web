import { createContext, useContext, useEffect, useState } from 'react';
import { useUserContext } from './user';
import { isEmpty } from '@/utils';

const TechniciansContext = createContext({
  assignmentToId: '',
  setAssignmentToId: (assignmentToId) => {},
  technicians: [],
  setTechnicians: (data) => {}
});

export const TechniciansProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const { user } = useUserContext();
  const [assignmentToId, setAssignmentToId] = useState();
  const [technicians, setTechnicians] = useState([]);

  useEffect(() => {
    if (isEmpty(user)) return;

    setAssignmentToId(user.id);
    setTechnicians([
      {
        subcontractor: {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`
        }
      },
      ...user.subcontractors.filter((sub) => sub.status === 'Accepted')
    ]);
  }, [user]);

  return (
    <TechniciansContext.Provider
      value={{ technicians, setTechnicians, assignmentToId, setAssignmentToId }}
    >
      {children}
    </TechniciansContext.Provider>
  );
};

export const useTechniciansContext = () => useContext(TechniciansContext);
