import { useToast } from '../../../components/ui/use-toast';
import { clientAxios } from '../../../lib/clientAxios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteClient = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { mutate, isPending } = useMutation({
    mutationFn: async (id) =>
      await clientAxios.delete('/clients', {
        data: { id }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      // push('/clients');
      toast({
        variant: 'default',
        title: 'Client deleted successfully',
        className: 'bg-green-500 text-white'
      });
    },
    onError: (error) => {
      toast({
        variant: 'default',
        title: 'Error deleting client',
        className: 'bg-red-500 text-white'
      });
    }
  });
  return { mutate, isPending };
};
