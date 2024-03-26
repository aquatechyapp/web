import { useToast } from '@/app/_components/ui/use-toast';
import { clientAxios } from '@/services/clientAxios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateAssignments = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { mutate, isPending } = useMutation({
    mutationFn: async (data) => await clientAxios.patch('/assignments', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      toast({
        variant: 'default',
        title: 'Updated assignments successfully',
        className: 'bg-green-500 text-white'
      });
    },
    onError: (error) => {
      toast({
        variant: 'default',
        title: 'Error updating assignments',
        className: 'bg-red-500 text-white'
      });
    }
  });
  return { mutate, isPending };
};
