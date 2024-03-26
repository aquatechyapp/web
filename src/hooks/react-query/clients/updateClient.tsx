import { useToast } from '@/app/_components/ui/use-toast';
import { clientAxios } from '@/services/clientAxios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';

export const useUpdateClient = () => {
  const queryClient = useQueryClient();
  const { push } = useRouter();
  const { toast } = useToast();
  const pathname = usePathname();
  const clientId = pathname.split('/')[2];
  const { mutate, isPending } = useMutation({
    mutationFn: async (data) =>
      // await clientAxios.patch('/clients', { data, clientId: pathname }),
      await clientAxios.patch('/clients', { ...data, clientId }),
    onSuccess: (data) => {
      // queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        variant: 'default',
        title: 'Client updated successfully',
        className: 'bg-green-500 text-white'
      });
    },
    onError: (error) => {
      toast({
        variant: 'default',
        title: 'Error updating client',
        className: 'bg-red-500 text-white'
      });
    }
  });
  return { mutate, isPending };
};
