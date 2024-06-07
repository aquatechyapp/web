import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useToast } from '@/components/ui/use-toast';
import { clientAxios } from '@/lib/clientAxios';

export const useDeleteAssignment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { mutate, isPending } = useMutation({
    mutationFn: async (assignmentId: string) => await clientAxios.delete('/assignments', { data: { assignmentId } }),
    onSuccess: () => {
      toast({
        duration: 2000,
        title: 'Assignment deleted successfully',
        className: 'bg-green-500 text-gray-50'
      });
    },
    onError: () => {
      toast({
        duration: 2000,
        title: 'Error deleting assignment',
        className: 'bg-red-500 text-gray-50'
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
    }
  });
  return { mutate, isPending };
};
