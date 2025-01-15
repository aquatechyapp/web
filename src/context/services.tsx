import { useQuery, useQueryClient } from '@tanstack/react-query';
import { differenceInWeeks, getDay, isAfter, isSameDay } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import Cookies from 'js-cookie';
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';

import { useMembersStore } from '@/store/members';
import { useWeekdayStore } from '@/store/weekday';
import { Frequency } from '@/ts/enums/enums';

import { LoadingSpinner } from '../components/LoadingSpinner';
import { clientAxios } from '../lib/clientAxios';
import { Service } from '@/ts/interfaces/Service';

function filterServicesByDay(services: Service[], selectedDay: string): Service[] {
  return services.filter((service) => {
    if (isSameDay(new Date(service.scheduledTo), new Date(selectedDay))) {
      return true;
    }
  });
}

type ServicesContextType = {
  services: Service[];
  setServices: Dispatch<SetStateAction<Service[]>>;
};

const ServicesContext = createContext<ServicesContextType>({
  services: [],
  setServices: () => {}
});

export const ServicesProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();

  const assignedToId = useMembersStore((state) => state.assignedToId);
  const selectedDay = useWeekdayStore((state) => state.selectedDay);

  const userId = Cookies.get('userId');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['schedule', userId],
    queryFn: async () => {
      if (!userId) {
        queryClient.cancelQueries({ queryKey: ['schedule'] });
        return [];
      }
      const response = await clientAxios.get('/services/scheduled');
      return response.data;
    },
    staleTime: 1000 * 60 * 60
  });

  const [services, setServices] = useState([] as Service[]);

  useEffect(() => {
    if (!userId) return;
    if (isError || isLoading) return;

    const filteredServices = data.services?.filter((service: Service) => service.assignedTo.id === assignedToId);

    const filteredServicesByDay = filterServicesByDay(filteredServices, selectedDay);

    setServices(filteredServicesByDay);
  }, [data, isError, isLoading, assignedToId, userId, selectedDay]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <ServicesContext.Provider
      value={{
        services,
        setServices
      }}
    >
      {children}
    </ServicesContext.Provider>
  );
};

export const useServicesContext = () => useContext(ServicesContext);
