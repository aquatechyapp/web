import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { clientAxios } from '@/lib/clientAxios';
import { toast } from '@/components/ui/use-toast';

type ErrorResponse = {
  message: string;
};

const deleteChecklistTemplate = async (templateId: string): Promise<void> => {
  await clientAxios.delete(`/checklist-templates/${templateId}`);
};

export const useDeleteChecklistTemplate = (clientId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteChecklistTemplate,
    onSuccess: () => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ['pools'] });
      queryClient.invalidateQueries({ queryKey: ['checklist-templates'] });
      queryClient.invalidateQueries({ queryKey: ['clients', clientId] });
      
      toast({
        title: 'Checklist deleted successfully',
        variant: 'success'
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error('Error deleting checklist template:', error);
      toast({
        title: 'Error deleting checklist',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'error'
      });
    }
  });
};
