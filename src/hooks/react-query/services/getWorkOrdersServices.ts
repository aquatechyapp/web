import { useQuery } from '@tanstack/react-query';

import { clientAxios } from '@/lib/clientAxios';
import { useState } from 'react';
import { Service } from '@/ts/interfaces/Service';

export interface UseGetWorkOrdersServicesParams {
  from: string;
  to: string;
  completedByUserId?: string | null;
  clientId?: string | null;
  companyOwnerId?: string | null;
  page?: number;
  limit: number;
}

export default function useGetWorkOrdersServices(initialData: UseGetWorkOrdersServicesParams) {
  const [data, setData] = useState<UseGetWorkOrdersServicesParams>({ ...initialData });

  const query = useQuery({
    queryKey: ['work-orders-services', data.from, data.to, data.completedByUserId, data.clientId, data.companyOwnerId, data.page],
    queryFn: async () => {
      const response = await clientAxios.get('/services/work-orders', {
        params: data
      });

      // Organize the services desc by scheduledTo (since work orders are scheduled)
      const services = response.data.services;
      const servicesByDate = services.sort((a: Service, b: Service) => {
        return new Date(b.scheduledTo).getTime() - new Date(a.scheduledTo).getTime();
      });

      return {
        ...response.data,
        services: servicesByDate
      };
    },
    enabled: Boolean(data.from && data.to) // Ensure the query only runs when required parameters are present
  });

  const refetch = async (newQueryParams: UseGetWorkOrdersServicesParams | undefined = undefined) => {
    if (newQueryParams) {
      setData(newQueryParams);
    }
    await query.refetch();
  };

  return { ...query, refetch };
}
