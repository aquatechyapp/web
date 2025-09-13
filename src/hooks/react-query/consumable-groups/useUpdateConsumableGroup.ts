import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { toast } from '@/components/ui/use-toast';
import { clientAxios } from '../../../lib/clientAxios';
import { UpdateConsumableGroupRequest, ConsumableGroupResponse } from '../../../ts/interfaces/ConsumableGroups';

type ErrorResponse = {
  message: string;
};

export const useUpdateConsumableGroup = (companyId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ consumableGroupId, data }: { consumableGroupId: string; data: UpdateConsumableGroupRequest }): Promise<ConsumableGroupResponse> => {
      const response = await clientAxios.patch(`/consumable-groups/${consumableGroupId}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consumable-groups', companyId] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast({
        title: 'Consumable group updated successfully',
        variant: 'success'
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast({
        title: 'Error updating consumable group',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'error'
      });
    }
  });
};

