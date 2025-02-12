import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useToast } from '../../../components/ui/use-toast';
import { clientAxios } from '../../../lib/clientAxios';

export const useEditCompanyMember = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate: handleSubmit, isPending } = useMutation({
    mutationFn: async ({
      companyId,
      companyMemberId,
      role
    }: {
      companyId: string;
      companyMemberId: string;
      role: string;
    }) =>
      await clientAxios.patch(`/companies/members/roles`, {
        companyId: companyId,
        memberId: companyMemberId,
        role
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companyMembers'] });
      toast({
        duration: 5000,
        title: 'Company member was updated successfully.',
        variant: 'success'
      });
    },
    onError: () => {
      toast({
        duration: 5000,
        title: 'Error updating company member.',
        variant: 'error'
      });
    }
  });
  return { handleSubmit, isPending };
};
