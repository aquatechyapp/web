import { useQuery } from '@tanstack/react-query';

import { clientAxios } from '../../../lib/clientAxios';
import { ServiceTypesResponse } from '../../../ts/interfaces/ServiceTypes';

export const useGetServiceTypes = (companyId: string) => {
  return useQuery({
    queryKey: ['service-types', companyId],
    queryFn: async (): Promise<ServiceTypesResponse> => {
      const response = await clientAxios.get(`/service-types/companies/${companyId}`);
      return response.data;
    },
    enabled: !!companyId
  });
};
