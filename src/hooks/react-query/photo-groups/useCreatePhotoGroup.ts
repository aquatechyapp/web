import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from '@/components/ui/use-toast';
import { clientAxios } from '../../../lib/clientAxios';
import { CreatePhotoGroupRequest, PhotoGroupResponse } from '../../../ts/interfaces/PhotoGroups';

type ErrorResponse = {
  message: string;
};

interface CreatePhotoGroupParams {
  companyId: string;
  data: CreatePhotoGroupRequest;
}

export const useCreatePhotoGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ companyId, data }: CreatePhotoGroupParams): Promise<PhotoGroupResponse> => {
      const response = await clientAxios.post(`/photo-groups/companies/${companyId}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['photo-groups', variables.companyId] });
      toast({
        title: 'Photo group created successfully',
        variant: 'success'
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast({
        title: 'Error creating photo group',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'error'
      });
    }
  });
};
