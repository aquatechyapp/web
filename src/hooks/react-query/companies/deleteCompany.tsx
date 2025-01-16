import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useToast } from '../../../components/ui/use-toast';
import { clientAxios } from '../../../lib/clientAxios';

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ companyId }: { companyId: string }) => await clientAxios.delete(`/companies/${companyId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast({
        duration: 5000,
        title: 'Company was deleted successfully.',
        variant: 'success'
      });
    },
    onError: () => {
      toast({
        duration: 5000,
        title: 'Error deleting company.',
        variant: 'error'
      });
    }
  });
  return { mutate, isPending };
};
