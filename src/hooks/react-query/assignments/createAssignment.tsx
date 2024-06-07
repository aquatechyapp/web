import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useToast } from '../../../components/ui/use-toast';
import { CreateAssignment } from '../../../interfaces/Assignments';
import { clientAxios } from '../../../lib/clientAxios';

export const useCreateAssignment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: CreateAssignment) => await clientAxios.post('/assignments', data),

    onError: () => {
      toast({
        duration: 2000,
        title: 'Error creating assignment',
        className: 'bg-red-500 text-gray-50'
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      toast({
        duration: 2000,
        title: 'Assignment created successfully',
        className: 'bg-green-500 text-gray-50'
      });
    }
  });
  return { mutate, isPending };
};
