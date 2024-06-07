import { useMutation } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';

import { useToast } from '@/components/ui/use-toast';
import { clientAxios } from '@/lib/clientAxios';

export const useUpdateClient = () => {
  const { toast } = useToast();
  const pathname = usePathname();
  const clientId = pathname.split('/')[2];

  const { mutate, isPending } = useMutation({
    mutationFn: async (data) => await clientAxios.patch('/clients', { ...data, clientId }),
    onSuccess: () => {
      toast({
        duration: 2000,
        title: 'Client updated successfully',
        className: 'bg-green-500 text-gray-50'
      });
    },
    onError: () => {
      toast({
        duration: 2000,
        title: 'Error updating client',
        className: 'bg-red-500 text-gray-50'
      });
    }
  });
  return { mutate, isPending };
};
