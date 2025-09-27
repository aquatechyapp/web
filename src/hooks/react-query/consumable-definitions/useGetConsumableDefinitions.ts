import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { clientAxios } from '../../../lib/clientAxios';
import { ConsumableDefinitionsResponse } from '../../../ts/interfaces/ConsumableGroups';

type ErrorResponse = {
  message: string;
};

export const useGetConsumableDefinitions = (consumableGroupId: string) => {
  return useQuery({
    queryKey: ['consumable-definitions', consumableGroupId],
    queryFn: async (): Promise<ConsumableDefinitionsResponse> => {
      const response = await clientAxios.get(`/consumable-definitions/consumable-groups/${consumableGroupId}`);
      return response.data;
    },
    enabled: !!consumableGroupId
  });
};

