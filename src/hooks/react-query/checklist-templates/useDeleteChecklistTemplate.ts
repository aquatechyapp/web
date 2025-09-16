import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { toast } from '@/components/ui/use-toast';
import { clientAxios } from '../../../lib/clientAxios';

type ErrorResponse = {
  message: string;
};

export const useDeleteChecklistTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (templateId: string): Promise<void> => {
      await clientAxios.delete(`/checklist-templates/${templateId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklist-templates'] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast({
        title: 'Checklist template deleted successfully',
        variant: 'success'
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast({
        title: 'Error deleting checklist template',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'error'
      });
    }
  });
};
