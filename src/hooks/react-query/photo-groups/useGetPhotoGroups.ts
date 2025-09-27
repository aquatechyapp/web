import { useQuery } from '@tanstack/react-query';
import { clientAxios } from '../../../lib/clientAxios';
import { PhotoGroupsResponse } from '../../../ts/interfaces/PhotoGroups';

export const useGetPhotoGroups = (companyId: string) => {
  return useQuery({
    queryKey: ['photo-groups', companyId],
    queryFn: async (): Promise<PhotoGroupsResponse> => {
      const response = await clientAxios.get(`/photo-groups/companies/${companyId}`);
      return response.data;
    },
    enabled: !!companyId
  });
};
