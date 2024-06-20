import { useMutation } from '@tanstack/react-query';

import { useToast } from '@/components/ui/use-toast';
import { clientAxios } from '@/lib/clientAxios';

export const useImportClientsFromCsv = () => {
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data) => await clientAxios.post('/importclientsandpools', data),
    onSuccess: () => {
      toast({
        duration: 2000,
        title: 'Clients created successfully',
        className: 'bg-green-500 text-gray-50'
      });
    },
    onError: () => {
      toast({
        duration: 2000,
        title: 'Error creating clients',
        className: 'bg-red-500 text-gray-50'
      });
    }
  });
  return { mutate, isPending };
};
