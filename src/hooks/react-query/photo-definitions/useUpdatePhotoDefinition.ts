import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { toast } from '@/components/ui/use-toast';
import { clientAxios } from '../../../lib/clientAxios';
import { UpdatePhotoDefinitionRequest, PhotoDefinitionResponse } from '../../../ts/interfaces/PhotoGroups';

type ErrorResponse = {
  message: string;
};

export const useUpdatePhotoDefinition = (companyId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ photoDefinitionId, data }: { photoDefinitionId: string; data: UpdatePhotoDefinitionRequest }): Promise<PhotoDefinitionResponse> => {
      const response = await clientAxios.put(`/photo-definitions/${photoDefinitionId}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photo-definitions'] });
      queryClient.invalidateQueries({ queryKey: ['photo-groups', companyId] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast({
        title: 'Photo definition updated successfully',
        variant: 'success'
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast({
        title: 'Error updating photo definition',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'error'
      });
    }
  });
};

