import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import Cookies from 'js-cookie';

import { useToast } from '../../../components/ui/use-toast';
import { clientAxios } from '../../../lib/clientAxios';
import { CreateAssignment } from '../../../ts/interfaces/Assignments';

export const useCreateAssignment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const userId = Cookies.get('userId');
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: CreateAssignment) => await clientAxios.post('/assignments', data),

    onError: (
      error: AxiosError<{
        message: string;
      }>
    ) => {
      toast({
        variant: 'error',
        title: 'Error creating assignment',
        description: error.response?.data?.message ? error.response.data.message : 'Internal server error'
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments', userId] });
      queryClient.invalidateQueries({ queryKey: ['schedule', userId] });
      toast({
        variant: 'success',
        duration: 2000,
        title: 'Assignment created successfully'
      });
    }
  });
  return { mutate, isPending };
};
