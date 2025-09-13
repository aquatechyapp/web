import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { clientAxios } from '../../../lib/clientAxios';
import { ReadingDefinitionsResponse } from '../../../ts/interfaces/ReadingGroups';

type ErrorResponse = {
  message: string;
};

export const useGetReadingDefinitions = (readingGroupId: string) => {
  return useQuery({
    queryKey: ['reading-definitions', readingGroupId],
    queryFn: async (): Promise<ReadingDefinitionsResponse> => {
      const response = await clientAxios.get(`/reading-definitions/reading-groups/${readingGroupId}`);
      return response.data;
    },
    enabled: !!readingGroupId
  });
};

