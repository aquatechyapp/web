import { useToast } from '../../../components/ui/use-toast';
import { clientAxios } from '../../../lib/clientAxios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/context/user';

export const useEditRelation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { setUser, user } = useUserContext();
  const { push } = useRouter();

  const { mutate: handleSubmit } = useMutation({
    mutationFn: async (data) => {
      return clientAxios.patch('/workrelations/update', {
        ...data,
        paymentValue: data.paymentValue,
      });
    },
    onSuccess: (res) => {
      // Mescla os dados do card editado com os dados existentes do usuário
      const updatedSubcontractors = user.subcontractors.map((subcontractor) => {
        if (subcontractor.id === res.data.id) {
          return res.data; // Substitui os dados do card editado
        }
        return subcontractor; // Mantém os outros cards inalterados
      });

      setUser((user) => ({
        ...user,
        subcontractors: updatedSubcontractors
      }));

      push('/team');
      toast({
        variant: 'default',
        title: 'Information updated with success.',
        className: 'bg-green-500 text-white'
      });
    },
    onError: (error) => {
      toast({
        variant: 'default',
        title: 'Error adding technician',
        className: 'bg-red-500 text-white'
      });
    }
  });

  return { handleSubmit };
};
