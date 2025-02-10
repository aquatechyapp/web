import { useQuery } from '@tanstack/react-query';

import { clientAxios } from '@/lib/clientAxios';
import { useState } from 'react';

export interface UseGetServicesParams {
  from: string;
  to: string;
  completedByUserId?: string | null;
  clientId?: string | null;
  companyOwnerId?: string | null;
  page?: number;
  limit: number;
}

export default function useGetServices(initialData: UseGetServicesParams) {
  const [data, setData] = useState<UseGetServicesParams>({ ...initialData });

  const query = useQuery({
    queryKey: ['services', data.from, data.to, data.completedByUserId, data.clientId, data.companyOwnerId, data.page],
    queryFn: async () => {
      const response = await clientAxios.get('/services', {
        params: data
      });

      console.log(response.data);

      return response.data;
    },
    enabled: Boolean(data.from && data.to) // Ensure the query only runs when required parameters are present
  });

  const refetch = async (newQueryParams: UseGetServicesParams | undefined = undefined) => {
    if (newQueryParams) {
      setData(newQueryParams);
    }
    await query.refetch();
  };

  return { ...query, refetch };
}
