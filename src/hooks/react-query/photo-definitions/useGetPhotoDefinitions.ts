import { useQuery } from '@tanstack/react-query';

import { clientAxios } from '../../../lib/clientAxios';
import { PhotoDefinitionsResponse } from '../../../ts/interfaces/PhotoGroups';

export const useGetPhotoDefinitions = (photoGroupId: string) => {
  return useQuery({
    queryKey: ['photo-definitions', photoGroupId],
    queryFn: async (): Promise<PhotoDefinitionsResponse> => {
      const response = await clientAxios.get(`/photo-definitions/groups/${photoGroupId}`);
      return response.data;
    },
    enabled: !!photoGroupId,
  });
};

