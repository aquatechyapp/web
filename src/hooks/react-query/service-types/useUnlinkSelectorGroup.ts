import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { toast } from '@/components/ui/use-toast';
import { clientAxios } from '@/lib/clientAxios';

type ErrorResponse = {
  message: string;
};

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
      queryClient.invalidateQueries({ queryKey: ['service-types'] });
      toast({
        title: 'Selector group unlinked successfully',
        variant: 'success'
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast({
        title: 'Error unlinking selector group',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'error'
      });
    }
  });
}
