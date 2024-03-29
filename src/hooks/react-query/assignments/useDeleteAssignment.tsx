import { useToast } from '@/app/_components/ui/use-toast';
import { clientAxios } from '@/services/clientAxios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteAssignment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { mutate, isPending } = useMutation({
    mutationFn: async (assignmentId: string) =>
      await clientAxios.delete('/assignments', { data: { assignmentId } }),
    onSuccess: () => {
      toast({
        title: 'Assignment deleted successfully',
        className: 'bg-green-500 text-white'
      });
    },
    onError: () => {
      toast({
        title: 'Error deleting assignment',
        className: 'bg-red-500 text-white'
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
    }
  });
  return { mutate, isPending };
};
