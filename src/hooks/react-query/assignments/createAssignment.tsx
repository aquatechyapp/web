import { useToast } from '@/app/_components/ui/use-toast';
import { CreateAssignment } from '@/interfaces/Assignments';
import { clientAxios } from '@/services/clientAxios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateAssignment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: CreateAssignment) =>
      await clientAxios.post('/assignments', data),

    onError: () => {
      toast({
        title: 'Error creating assignment',
        className: 'bg-red-500 text-white'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      toast({
        title: 'Assignment created successfully',
        className: 'bg-green-500 text-white'
      });
    }
  });
  return { mutate, isPending };
};
