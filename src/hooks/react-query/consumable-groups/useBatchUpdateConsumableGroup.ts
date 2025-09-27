import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { toast } from '@/components/ui/use-toast';
import { clientAxios } from '../../../lib/clientAxios';
import { CrudConsumableGroupRequest, CrudConsumableGroupResponse } from '../../../ts/interfaces/ConsumableGroups';

type ErrorResponse = {
  message: string;
};

export const useBatchUpdateConsumableGroup = (companyId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      consumableGroupId,
      data
    }: {
      consumableGroupId: string;
      data: CrudConsumableGroupRequest
    }): Promise<CrudConsumableGroupResponse> => {
      const response = await clientAxios.put(`/consumable-groups/${consumableGroupId}/crud`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consumable-definitions'] });
      queryClient.invalidateQueries({ queryKey: ['consumable-groups', companyId] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast({
        title: 'Consumable definitions updated successfully',
        description: 'All changes have been saved',
        variant: 'success'
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast({
        title: 'Error updating consumable definitions',
        description: error.response?.data?.message || 'An error occurred while saving changes',
        variant: 'error'
      });
    }
  });
};
