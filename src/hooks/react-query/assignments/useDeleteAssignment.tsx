import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import Cookies from 'js-cookie';

import { useToast } from '@/components/ui/use-toast';
import { clientAxios } from '@/lib/clientAxios';

export const useDeleteAssignment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const userId = Cookies.get('userId');

  const { mutate, isPending } = useMutation({
    mutationFn: async (assignmentId: string) => {
      return await clientAxios.delete('/assignments', { data: { assignmentId } });
    },
    onSuccess: (_data, assignmentId) => {
      // Invalidate and refetch assignments and schedule
      queryClient.invalidateQueries({ queryKey: ['assignments', userId] });
      queryClient.invalidateQueries({ queryKey: ['assignments', 'by-pool'] });
      queryClient.invalidateQueries({ queryKey: ['schedule', userId] });

      toast({
        duration: 2000,
        title: 'Assignment deleted successfully',
        variant: 'success'
      });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error('Delete assignment error:', error);
      toast({
        variant: 'error',
        title: 'Error deleting assignment',
        description: error.response?.data?.message || error.message || 'Internal server error'
      });
    }
  });
  return { mutate, isPending };
};
