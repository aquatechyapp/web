import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CreateRequest } from '@/app/(authenticated)/requests/ModalAddRequest';
import { clientAxios } from '@/lib/clientAxios';
import { createFormData } from '@/utils/formUtils';

import { useToast } from '../../../components/ui/use-toast';

export const useCreateRequest = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: CreateRequest) =>
      await clientAxios.post('/requests', createFormData(data), {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      toast({
        duration: 2000,
        title: 'Request created successfully',
        className: 'bg-green-500 text-gray-50'
      });
    },
    onError: () => {
      toast({
        duration: 2000,
        title: 'Error creating Request',
        className: 'bg-red-500 text-gray-50'
      });
    }
  });
  return { mutate, isPending };
};
