import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { toast } from '@/components/ui/use-toast';
import { clientAxios } from '../../../lib/clientAxios';

type BulkUpdateRequest = {
  photoDefinitionId: string;
  order: number;
}[];

type ErrorResponse = {
  message: string;
};

export const useBulkUpdatePhotoDefinitions = (companyId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: BulkUpdateRequest): Promise<void> => {
      // Update each photo definition with its new order
      const updatePromises = data.map(({ photoDefinitionId, order }) =>
        clientAxios.put(`/photo-definitions/${photoDefinitionId}`, { order })
      );
      
      await Promise.all(updatePromises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photo-definitions'] });
      queryClient.invalidateQueries({ queryKey: ['photo-groups', companyId] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast({
        title: 'Photo definitions order updated successfully',
        variant: 'success'
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast({
        title: 'Error updating photo definitions order',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'error'
      });
    }
  });
};

