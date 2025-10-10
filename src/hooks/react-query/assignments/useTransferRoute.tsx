import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { useToast } from '@/components/ui/use-toast';
import { useAssignmentsContext } from '@/context/assignments';
import { clientAxios } from '@/lib/clientAxios';
import { Assignment, TransferAssignment } from '@/ts/interfaces/Assignments';
import Cookies from 'js-cookie';

export interface TransferResult {
  assignmentId: string;
  success: boolean;
  message?: string;
}

export interface TransferResponse {
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  results: TransferResult[];
}

async function transferPermanently(data: Partial<Assignment>[]): Promise<TransferResponse> {
  const response = await clientAxios.post<TransferResponse>('/assignments/transferpermanently', data);
  return response.data;
}

export const useTransferPermanentlyRoute = (
  assignmentToTransfer: Assignment | undefined, 
  onSuccessCallback?: (result: TransferResponse) => void, 
  onErrorCallback?: (errorMessage: string) => void
) => {
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
      const errorMessage = error.response?.data?.message ? error.response.data.message : 'Internal server error';
      
      // Necessary because it can return an error but some assignments may have been transferred successfully
      queryClient.invalidateQueries({ queryKey: ['assignments', userId] });
      queryClient.invalidateQueries({ queryKey: ['schedule', userId] });
      
      // Call the error callback to display error in dialog
      if (onErrorCallback) {
        onErrorCallback(errorMessage);
      }
      
    },
    onSuccess: (data: TransferResponse) => {
      queryClient.invalidateQueries({ queryKey: ['assignments', userId] });
      queryClient.invalidateQueries({ queryKey: ['schedule', userId] });
      
      // Show toast based on results
      if (data.failureCount === 0) {
        toast({
          duration: 2000,
          title: 'All assignments transferred successfully',
          variant: 'success'
        });
      } else if (data.successCount > 0) {
        toast({
          duration: 3000,
          title: `${data.successCount} of ${data.totalProcessed} assignments transferred`,
          description: 'Some transfers failed. Check the details.',
          variant: 'default'
        });
      }
      
      // Call the success callback with the result data
      if (onSuccessCallback) {
        onSuccessCallback(data);
      }
    }
  });
  return { mutate, isPending };
};
