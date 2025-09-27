import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { toast } from '@/components/ui/use-toast';
import { clientAxios } from '../../../lib/clientAxios';
import { CrudPhotoGroupRequest, CrudPhotoGroupResponse } from '../../../ts/interfaces/PhotoGroups';

type ErrorResponse = {
  message: string;
};

export const useBatchUpdatePhotoGroup = (companyId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      photoGroupId,
      data
    }: {
      photoGroupId: string;
      data: CrudPhotoGroupRequest
    }): Promise<CrudPhotoGroupResponse> => {
      const response = await clientAxios.put(`/photo-groups/${photoGroupId}/crud`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photo-definitions'] });
      queryClient.invalidateQueries({ queryKey: ['photo-groups', companyId] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast({
        title: 'Photo definitions updated successfully',
        description: 'All changes have been saved',
        variant: 'success'
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast({
        title: 'Error updating photo definitions',
        description: error.response?.data?.message || 'An error occurred while saving changes',
        variant: 'error'
      });
    }
  });
};
