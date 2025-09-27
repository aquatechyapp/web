import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { toast } from '@/components/ui/use-toast';
import { clientAxios } from '../../../lib/clientAxios';

type ErrorResponse = {
  message: string;
};

export const useDeleteReadingDefinition = (companyId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (readingDefinitionId: string): Promise<void> => {
      await clientAxios.delete(`/reading-definitions/${readingDefinitionId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reading-definitions'] });
      queryClient.invalidateQueries({ queryKey: ['reading-groups', companyId] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast({
        title: 'Reading definition deleted successfully',
        variant: 'success'
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast({
        title: 'Error deleting reading definition',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'error'
      });
    }
  });
};

