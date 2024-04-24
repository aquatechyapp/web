import { createFormData } from '@/utils/formUtils';
import { useToast } from '../../../components/ui/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { clientAxios } from '@/lib/clientAxios';

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
        variant: 'default',
        title: 'Pool created successfully',
        className: 'bg-green-500 text-white'
      });
    },
    onError: (error) => {
      toast({
        variant: 'default',
        title: 'Error creating pool',
        className: 'bg-red-500 text-white'
      });
    }
  });
  return { mutate, isPending };
};
