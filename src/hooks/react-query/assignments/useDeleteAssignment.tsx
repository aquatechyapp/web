import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

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
        variant: 'success'
      });
    },
    onError: (
      error: AxiosError<{
        message: string;
      }>
    ) => {
      toast({
        variant: 'error',
        title: 'Error deleting assignment',
        description: error.response?.data?.message ? error.response.data.message : 'Internal server error'
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
    }
  });
  return { mutate, isPending };
};
