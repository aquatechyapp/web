import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { toast } from '@/components/ui/use-toast';
import { clientAxios } from '../../../lib/clientAxios';
import { LinkConsumableGroupRequest, ServiceTypeConsumableGroupResponse } from '../../../ts/interfaces/ServiceTypes';

type ErrorResponse = {
  message: string;
};

export const useLinkConsumableGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ serviceTypeId, data }: { serviceTypeId: string; data: LinkConsumableGroupRequest }): Promise<ServiceTypeConsumableGroupResponse> => {
      const response = await clientAxios.post(`/service-types/${serviceTypeId}/consumable-groups`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-types'] });
      toast({
        title: 'Consumable group linked successfully',
        variant: 'success'
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast({
        title: 'Error linking consumable group',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'error'
      });
    }
  });
};
