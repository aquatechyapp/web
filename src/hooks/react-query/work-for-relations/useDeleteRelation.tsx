import { useToast } from '../../../components/ui/use-toast';
import { clientAxios } from '../../../lib/clientAxios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteRelation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { mutate, isPending } = useMutation({
    mutationFn: async ({ workRelationId }: { workRelationId: string }) =>
      await clientAxios.delete('/workrelations', {
        data: { workRelationId }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast({
        variant: 'default',
        title: 'Deleted relation successfully',
        className: 'bg-green-500 text-gray-50'
      });
    },
    onError: () => {
      toast({
        variant: 'default',
        title: 'Error deleting relation',
        className: 'bg-red-500 text-gray-50'
      });
    }
  });
  return { mutate, isPending };
};
