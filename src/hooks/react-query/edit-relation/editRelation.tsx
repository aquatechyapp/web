import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useShallow } from 'zustand/react/shallow';

import { FormSchema } from '@/app/(authenticated)/team/ModalEdit';
import { useUserStore } from '@/store/user';
import { WorkRelation } from '@/ts/interfaces/User';

import { useToast } from '../../../components/ui/use-toast';
import { clientAxios } from '../../../lib/clientAxios';

export const useEditRelation = () => {
  const { toast } = useToast();
  const { setUser, user } = useUserStore(
    useShallow((state) => ({
      setUser: state.setUser,
      user: state.user
    }))
  );
  const { push } = useRouter();

  const { mutate: handleSubmit } = useMutation({
    mutationFn: async (data: FormSchema) => {
      return clientAxios.patch('/workrelations/update', {
        ...data,
        paymentValue: data.paymentValue
      });
    },
    onSuccess: (res) => {
      // Mescla os dados do card editado com os dados existentes do usuário
      const updatedSubcontractors: WorkRelation[] = user!.workRelationsAsAEmployer.map((subcontractor) => {
        if (subcontractor.id === res.data.id) {
          return res.data; // Substitui os dados do card editado
        }
        return subcontractor; // Mantém os outros cards inalterados
      });

      // Atualiza o usuário com os dados mesclados
      setUser({
        ...user,
        workRelationsAsAEmployer: updatedSubcontractors
      });

      push('/team');
      toast({
        duration: 2000,
        title: 'Information updated with success.',
        variant: 'success'
      });
    },
    onError: (
      error: AxiosError<{
        message: string;
      }>
    ) => {
      toast({
        duration: 2000,
        variant: 'error',
        title: 'Error adding technician',
        description: error.response?.data?.message ? error.response.data.message : 'Internal server error'
      });
    }
  });

  return { handleSubmit };
};
