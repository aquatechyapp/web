import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { toast } from '@/components/ui/use-toast';
import { clientAxios } from '../../../lib/clientAxios';

type ErrorResponse = {
  message: string;
};

export const useDeletePhotoDefinition = (companyId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (photoDefinitionId: string): Promise<void> => {
      await clientAxios.delete(`/photo-definitions/${photoDefinitionId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photo-definitions'] });
      queryClient.invalidateQueries({ queryKey: ['photo-groups', companyId] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast({
        title: 'Photo definition deleted successfully',
        variant: 'success'
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast({
        title: 'Error deleting photo definition',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'error'
      });
    }
  });
};

