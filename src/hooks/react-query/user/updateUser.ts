import { useToast } from '@/app/_components/ui/use-toast';
import { clientAxios } from '@/services/clientAxios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateUser = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: async (data) =>
      // await clientAxios.patch('/clients', { data, clientId: pathname }),
      await clientAxios.patch('/users', data),
    onSuccess: (data, dois, tres) => {
      console.log(data, dois, tres);
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast({
        variant: 'default',
        title: 'User updated successfully',
        className: 'bg-green-500 text-white'
      });
    },
    onError: (error) => {
      toast({
        variant: 'default',
        title: 'Error updating user',
        className: 'bg-red-500 text-white'
      });
    }
  });
  return { mutate, isPending };
};
