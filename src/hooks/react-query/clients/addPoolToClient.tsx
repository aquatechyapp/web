import { useMutation, useQueryClient } from '@tanstack/react-query';

import { clientAxios } from '@/lib/clientAxios';
import { createFormData } from '@/utils/formUtils';

import { useToast } from '../../../components/ui/use-toast';

export const useAddPoolToClient = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { mutate, isPending } = useMutation({
    mutationFn: async (data) =>
      await clientAxios.post('/pools', createFormData(data), {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        duration: 2000,
        title: 'Pool created successfully',
        className: 'bg-green-500 text-gray-50'
      });
    },
    onError: (error) => {
      toast({
        duration: 2000,
        title: 'Error creating pool',
        className: 'bg-red-500 text-gray-50'
      });
    }
  });
  return { mutate, isPending };
};
