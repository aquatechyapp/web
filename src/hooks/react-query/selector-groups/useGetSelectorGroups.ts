import { useQuery } from '@tanstack/react-query';
import { clientAxios } from '@/lib/clientAxios';
import { SelectorGroupsResponse } from '@/ts/interfaces/SelectorGroups';

export function useGetSelectorGroups(companyId: string) {
  return useQuery({
    queryKey: ['selectorGroups', companyId],
    queryFn: async (): Promise<SelectorGroupsResponse> => {
      const response = await clientAxios.get(`/selector-groups/companies/${companyId}`);
      return response.data;
    },
    enabled: !!companyId,
  });
}
