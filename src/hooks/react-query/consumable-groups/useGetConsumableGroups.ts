import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { clientAxios } from '../../../lib/clientAxios';
import { ConsumableGroupsResponse } from '../../../ts/interfaces/ConsumableGroups';

type ErrorResponse = {
  message: string;
};

export const useGetConsumableGroups = (companyId: string) => {
  return useQuery({
    queryKey: ['consumable-groups', companyId],
    queryFn: async (): Promise<ConsumableGroupsResponse> => {
      const response = await clientAxios.get(`/consumable-groups/companies/${companyId}`);
      return response.data;
    },
    enabled: !!companyId
  });
};

