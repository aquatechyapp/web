import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { z } from 'zod';

import { useToast } from '@/components/ui/use-toast';
import { clientAxios } from '@/lib/clientAxios';
import { editPoolSchema } from '@/schemas/pool';

export const useUpdatePool = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ data }: { data: z.infer<typeof editPoolSchema> }) =>
      await clientAxios.patch('/pools', { ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pools'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        duration: 2000,
        title: 'Pool updated successfully',
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
        title: 'Error updating pool',
        description: error.response?.data?.message ? error.response.data.message : 'Internal server error'
      });
    }
  });
  return { mutate, isPending };
};
