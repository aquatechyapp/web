import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { useToast } from '../../../components/ui/use-toast';
import { clientAxios } from '../../../lib/clientAxios';
import { CreateAssignment } from '../../../ts/interfaces/Assignments';
import { z } from 'zod';
import { QueryKeys } from '@/constants/query-keys';

export type RemoveAssignmentInput = {
  assignmentId: string;
};

export async function removeAssignmentFn({ assignmentId }: RemoveAssignmentInput) {
  return await clientAxios.delete('/assignments', { data: { assignmentId } });
}

export const useRemoveAssignmentService = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (assignmentId: RemoveAssignmentInput) => removeAssignmentFn(assignmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.ASSIGNMENTS, 'schedule'] });
      toast({
        variant: 'success',
        duration: 2000,
        title: 'Assignment removed successfully',
        description: 'The assignment has been removed successfully'
      });
    },
    onError: (
      error: AxiosError<{
        message: string;
      }>
    ) => {
      toast({
        variant: 'error',
        title: 'Error removing assignment',
        description: error.response?.data?.message ? error.response.data.message : 'Internal server error'
      });
    }
  });
};
