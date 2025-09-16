import { useMutation, useQueryClient } from '@tanstack/react-query';
import { clientAxios } from '@/lib/clientAxios';
import { LinkSelectorGroupRequest, ServiceTypeSelectorGroupResponse } from '@/ts/interfaces/SelectorGroups';

interface LinkSelectorGroupParams {
  serviceTypeId: string;
  data: LinkSelectorGroupRequest;
}

export function useLinkSelectorGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ serviceTypeId, data }: LinkSelectorGroupParams): Promise<ServiceTypeSelectorGroupResponse> => {
      const response = await clientAxios.post(`/service-types/${serviceTypeId}/selector-groups`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceTypes'] });
    },
  });
}
