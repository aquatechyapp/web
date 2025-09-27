import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { toast } from '@/components/ui/use-toast';
import { clientAxios } from '../../../lib/clientAxios';
import { CreateConsumableDefinitionRequest, ConsumableDefinitionResponse } from '../../../ts/interfaces/ConsumableGroups';

type ErrorResponse = {
  message: string;
};

export const useCreateConsumableDefinition = (companyId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ consumableGroupId, data }: { consumableGroupId: string; data: CreateConsumableDefinitionRequest }): Promise<ConsumableDefinitionResponse> => {
      const response = await clientAxios.post(`/consumable-definitions/consumable-groups/${consumableGroupId}`, data);
      return response.data;
    },
    onSuccess: (_, { consumableGroupId }) => {
      queryClient.invalidateQueries({ queryKey: ['consumable-definitions', consumableGroupId] });
      queryClient.invalidateQueries({ queryKey: ['consumable-groups', companyId] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast({
        title: 'Consumable definition created successfully',
        variant: 'success'
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast({
        title: 'Error creating consumable definition',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'error'
      });
    }
  });
};

