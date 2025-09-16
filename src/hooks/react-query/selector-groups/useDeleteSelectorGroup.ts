import { useMutation, useQueryClient } from '@tanstack/react-query';
import { clientAxios } from '@/lib/clientAxios';
import { useToast } from '@/components/ui/use-toast';

interface DeleteSelectorGroupParams {
  selectorGroupId: string;
  companyId: string;
}

export function useDeleteSelectorGroup() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ selectorGroupId }: DeleteSelectorGroupParams): Promise<{ message: string }> => {
      const response = await clientAxios.delete(`/selector-groups/${selectorGroupId}`);
      return response.data;
    },
    onSuccess: (_, { companyId }) => {
      queryClient.invalidateQueries({ queryKey: ['selectorGroups', companyId] });
      queryClient.invalidateQueries({ queryKey: ['selectorDefinitions'] });
      queryClient.invalidateQueries({ queryKey: ['selectorOptions'] });
      toast({
        duration: 2000,
        title: 'Selector group deleted successfully',
        variant: 'success'
      });
    },
    onError: (error: any) => {
      toast({
        duration: 2000,
        variant: 'error',
        title: 'Error deleting selector group',
        description: error.response?.data?.message || 'Internal server error'
      });
    },
  });
}
