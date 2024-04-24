import { useToast } from '../../../components/ui/use-toast';
import { clientAxios } from '../../../lib/clientAxios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateUser = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: async (data) => await clientAxios.patch('/users', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast({
        variant: 'default',
        title: 'User updated successfully',
        className: 'bg-green-500 text-white'
      });
    },
    onError: () => {
      toast({
        variant: 'default',
        title: 'Error updating user',
        className: 'bg-red-500 text-white'
      });
    }
  });
  return { mutate, isPending };
};
