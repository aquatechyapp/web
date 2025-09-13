import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { clientAxios } from '../../../lib/clientAxios';
import { ReadingGroupsResponse } from '../../../ts/interfaces/ReadingGroups';

type ErrorResponse = {
  message: string;
};

export const useGetReadingGroups = (companyId: string) => {
  return useQuery({
    queryKey: ['reading-groups', companyId],
    queryFn: async (): Promise<ReadingGroupsResponse> => {
      const response = await clientAxios.get(`/reading-groups/companies/${companyId}`);
      return response.data;
    },
    enabled: !!companyId
  });
};

