import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { toast } from '@/components/ui/use-toast';
import { clientAxios } from '@/lib/clientAxios';
import { LinkSelectorGroupRequest, ServiceTypeSelectorGroupResponse } from '@/ts/interfaces/SelectorGroups';

type ErrorResponse = {
  message: string;
};

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
      queryClient.invalidateQueries({ queryKey: ['service-types'] });
      toast({
        title: 'Selector group linked successfully',
        variant: 'success'
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast({
        title: 'Error linking selector group',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'error'
      });
    }
  });
}
