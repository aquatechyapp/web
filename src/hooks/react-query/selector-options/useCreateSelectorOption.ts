import { useMutation, useQueryClient } from '@tanstack/react-query';
import { clientAxios } from '@/lib/clientAxios';
import { CreateSelectorOptionRequest, SelectorOptionResponse } from '@/ts/interfaces/SelectorGroups';
import { useToast } from '@/components/ui/use-toast';

interface CreateSelectorOptionParams {
  selectorDefinitionId: string;
  data: CreateSelectorOptionRequest;
}

export function useCreateSelectorOption() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ selectorDefinitionId, data }: CreateSelectorOptionParams): Promise<SelectorOptionResponse> => {
      const response = await clientAxios.post(`/selector-options/definitions/${selectorDefinitionId}`, data);
      return response.data;
    },
    onSuccess: (_, { selectorDefinitionId }) => {
      queryClient.invalidateQueries({ queryKey: ['selectorOptions', selectorDefinitionId] });
      queryClient.invalidateQueries({ queryKey: ['selectorDefinitions'] });
      queryClient.invalidateQueries({ queryKey: ['selectorGroups'] });
      toast({
        duration: 2000,
        title: 'Option created successfully',
        variant: 'success'
      });
    },
    onError: (error: any) => {
      toast({
        duration: 2000,
        variant: 'error',
        title: 'Error creating option',
        description: error.response?.data?.message || 'Internal server error'
      });
    },
  });
}
