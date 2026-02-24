import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { useToast } from '../../../components/ui/use-toast';
import { clientAxios } from '../../../lib/clientAxios';

export const useDeleteCompanyMember = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ companyId, memberId }: { companyId: string; memberId: string }) =>
      await clientAxios.delete(`/companies/members`, {
        data: {
          companyId,
          memberId
        }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companyMembers'] });
      toast({
        duration: 5000,
        title: 'Company member was removed successfully.',
        variant: 'success'
      });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast({
        duration: 5000,
        title: 'Error removing company member.',
        description: error.response?.data?.message ?? 'Something went wrong.',
        variant: 'error'
      });
    }
  });
  return { mutate, isPending };
};
