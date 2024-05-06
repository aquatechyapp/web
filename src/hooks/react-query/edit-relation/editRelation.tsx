import { useToast } from '../../../components/ui/use-toast';
import { clientAxios } from '../../../lib/clientAxios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/context/user';

export const useEditRelation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { setUser, user} = useUserContext();
  const { push } = useRouter();

  const { mutate: handleSubmit } = useMutation({
    mutationFn: async (data) => {
      console.log(data)
      return clientAxios.patch('/workrelations/update', {
        ...data,
        paymentValue: data.paymentValue,
      });
    },
    onSuccess: (res) => {
      setUser((user) => ({
        ...user,
        subcontractors: [res.data]
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
