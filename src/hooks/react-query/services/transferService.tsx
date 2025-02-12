import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { useToast } from '@/components/ui/use-toast';
import { useAssignmentsContext } from '@/context/assignments';
import { clientAxios } from '@/lib/clientAxios';
import { Assignment, TransferAssignment } from '@/ts/interfaces/Assignments';
import Cookies from 'js-cookie';
import { Service, TransferService } from '@/ts/interfaces/Service';
import { useServicesContext } from '@/context/services';
import { createFormData } from '@/utils/formUtils';

export const useTransferService = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const userId = Cookies.get('userId');

  const { mutate, isPending } = useMutation({
    mutationFn: async (form: TransferService) => {
      const response = await clientAxios.patch('/services', createFormData(form), {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    },
    onError: (
      error: AxiosError<{
        message: string;
      }>
    ) => {
      toast({
        duration: 5000,
        variant: 'error',
        title: 'Error transferring service',
        description: error.response?.data?.message ? error.response.data.message : 'Internal server error'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments', userId] });
      queryClient.invalidateQueries({ queryKey: ['schedule', userId] });
      toast({
        duration: 5000,
        title: 'Service transferred successfully',
        variant: 'success'
      });
    }
  });
  return { mutate, isPending };
};
