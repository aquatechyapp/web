import { useMutation, useQueryClient } from '@tanstack/react-query';
import { clientAxios } from '@/lib/clientAxios';

interface UnlinkSelectorGroupParams {
  serviceTypeId: string;
  selectorGroupId: string;
}

export function useUnlinkSelectorGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ serviceTypeId, selectorGroupId }: UnlinkSelectorGroupParams): Promise<{ message: string }> => {
      const response = await clientAxios.delete(`/service-types/${serviceTypeId}/selector-groups/${selectorGroupId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceTypes'] });
    },
  });
}
