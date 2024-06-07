import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useToast } from '../../../components/ui/use-toast';
import { clientAxios } from '../../../lib/clientAxios';

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
        duration: 2000,
        title: 'Deleted relation successfully',
        className: 'bg-green-500 text-gray-50'
      });
    },
    onError: () => {
      toast({
        duration: 2000,
        title: 'Error deleting relation',
        className: 'bg-red-500 text-gray-50'
      });
    }
  });
  return { mutate, isPending };
};
