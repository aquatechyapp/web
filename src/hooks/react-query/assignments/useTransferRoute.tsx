import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { useToast } from '@/components/ui/use-toast';
import { useAssignmentsContext } from '@/context/assignments';
import { clientAxios } from '@/lib/clientAxios';
import { Assignment, TransferAssignment } from '@/ts/interfaces/Assignments';
import Cookies from 'js-cookie';

async function transferPermanently(data: Partial<Assignment>[]) {
  const response = await clientAxios.post('/assignments/transferpermanently', data);
  return response.data;
}

export const useTransferPermanentlyRoute = (assignmentToTransfer: Assignment | undefined, onSuccessCallback?: () => void, onErrorCallback?: () => void) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { assignments } = useAssignmentsContext();
  const userId = Cookies.get('userId');

  const assignmentsToTransfer: Assignment[] = assignmentToTransfer ? [assignmentToTransfer] : assignments.current;

  const { mutate, isPending } = useMutation({
    mutationFn: (form: TransferAssignment) => {
      const assignments = assignmentsToTransfer!.map((assignment) => {
        return {
          ...assignment,
          ...form,
          assignmentId: assignment.id
        };
      });
      return transferPermanently(assignments);
    },
    onError: (
      error: AxiosError<{
        message: string;
      }>
    ) => {
      toast({
        duration: 10000,
        variant: 'error',
        title: 'Error creating assignment',
        description: error.response?.data?.message ? error.response.data.message : 'Internal server error'
      });
      // Necessary because it can return an error but some assignments may have been transferred successfully
      queryClient.invalidateQueries({ queryKey: ['assignments', userId] });
      queryClient.invalidateQueries({ queryKey: ['schedule', userId] });
      // Call the error callback to clear manual loading state
      if (onErrorCallback) {
        onErrorCallback();
      }
      
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments', userId] });
      queryClient.invalidateQueries({ queryKey: ['schedule', userId] });
      toast({
        duration: 2000,
        title: 'Assignment transferred successfully',
        variant: 'success'
      });
      // Call the success callback to close the modal
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    }
  });
  return { mutate, isPending };
};
