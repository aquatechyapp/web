import { useQuery } from '@tanstack/react-query';
import { clientAxios } from '@/lib/clientAxios';
import { SelectorOptionsResponse } from '@/ts/interfaces/SelectorGroups';

export function useGetSelectorOptions(selectorDefinitionId: string) {
  return useQuery({
    queryKey: ['selectorOptions', selectorDefinitionId],
    queryFn: async (): Promise<SelectorOptionsResponse> => {
      const response = await clientAxios.get(`/selector-options/definitions/${selectorDefinitionId}`);
      return response.data;
    },
    enabled: !!selectorDefinitionId,
  });
}
