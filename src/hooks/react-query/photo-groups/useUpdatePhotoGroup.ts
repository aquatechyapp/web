import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from '@/components/ui/use-toast';
import { clientAxios } from '../../../lib/clientAxios';
import { UpdatePhotoGroupRequest, PhotoGroupResponse } from '../../../ts/interfaces/PhotoGroups';

type ErrorResponse = {
  message: string;
};

interface UpdatePhotoGroupParams {
  photoGroupId: string;
  data: UpdatePhotoGroupRequest;
}

export const useUpdatePhotoGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ photoGroupId, data }: UpdatePhotoGroupParams): Promise<PhotoGroupResponse> => {
      const response = await clientAxios.patch(`/photo-groups/${photoGroupId}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photo-groups'] });
      toast({
        title: 'Photo group updated successfully',
        variant: 'success'
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast({
        title: 'Error updating photo group',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'error'
      });
    }
  });
};
