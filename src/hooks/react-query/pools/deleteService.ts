import { useToast } from '@/app/_components/ui/use-toast';
import { clientAxios } from '@/services/clientAxios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteService = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { mutate, isPending } = useMutation({
    mutationFn: async ({ serviceId, assignmentId }) =>
      await clientAxios.delete('/services', {
        data: { serviceId, assignmentId }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        variant: 'default',
        title: 'Deleted service successfully',
        className: 'bg-green-500 text-white'
      });
    },
    onError: (error) => {
      toast({
        variant: 'default',
        title: 'Error deleting service',
        className: 'bg-red-500 text-white'
      });
    }
  });
  return { mutate, isPending };
};
