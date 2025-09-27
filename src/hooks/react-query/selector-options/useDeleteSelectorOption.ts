import { useMutation, useQueryClient } from '@tanstack/react-query';
import { clientAxios } from '@/lib/clientAxios';
import { useToast } from '@/components/ui/use-toast';

interface DeleteSelectorOptionParams {
  selectorOptionId: string;
  selectorDefinitionId: string;
}

export function useDeleteSelectorOption() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ selectorOptionId }: DeleteSelectorOptionParams): Promise<{ message: string }> => {
      const response = await clientAxios.delete(`/selector-options/${selectorOptionId}`);
      return response.data;
    },
    onSuccess: (_, { selectorDefinitionId }) => {
      queryClient.invalidateQueries({ queryKey: ['selectorOptions', selectorDefinitionId] });
      queryClient.invalidateQueries({ queryKey: ['selectorDefinitions'] });
      queryClient.invalidateQueries({ queryKey: ['selectorGroups'] });
      toast({
        duration: 2000,
        title: 'Option deleted successfully',
        variant: 'success'
      });
    },
    onError: (error: any) => {
      toast({
        duration: 2000,
        variant: 'error',
        title: 'Error deleting option',
        description: error.response?.data?.message || 'Internal server error'
      });
    },
  });
}
