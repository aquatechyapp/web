import { useToast } from '@/components/ui/use-toast';
import { clientAxios } from '@/lib/clientAxios';
import { useMutation } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';

export const useUpdateClient = () => {
  const { toast } = useToast();
  const pathname = usePathname();
  const clientId = pathname.split('/')[2];

  const { mutate, isPending } = useMutation({
    mutationFn: async (data) =>
      await clientAxios.patch('/clients', { ...data, clientId }),
    onSuccess: () => {
      toast({
        variant: 'default',
        title: 'Client updated successfully',
        className: 'bg-green-500 text-gray-50'
      });
    },
    onError: () => {
      toast({
        variant: 'default',
        title: 'Error updating client',
        className: 'bg-red-500 text-gray-50'
      });
    }
  });
  return { mutate, isPending };
};
