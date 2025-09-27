import { useQuery } from '@tanstack/react-query';
import { clientAxios } from '@/lib/clientAxios';
import { SelectorDefinitionsResponse } from '@/ts/interfaces/SelectorGroups';

export function useGetSelectorDefinitions(selectorGroupId: string) {
  return useQuery({
    queryKey: ['selectorDefinitions', selectorGroupId],
    queryFn: async (): Promise<SelectorDefinitionsResponse> => {
      const response = await clientAxios.get(`/selector-definitions/groups/${selectorGroupId}`);
      return response.data;
    },
    enabled: !!selectorGroupId,
  });
}
